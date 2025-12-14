import { type MazeGeneratorStrategy, type MazeGeneratorParams, type MazeStep } from './types';
import { type Position, isWithinBounds, applyOffset } from './maze-utils';

/**
 * Rectangle type representing a region in the BSP tree
 */
interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * BSP (Binary Space Partitioning) Maze Generator
 *
 * Algorithm: Recursively divides space into rectangles (rooms), then connects them
 * - Start with full grid rectangle
 * - Recursively split into smaller rectangles
 * - Create rooms within leaf rectangles
 * - Connect rooms with corridors
 * - Common in roguelike dungeon generation
 *
 * Characteristics: Creates rectangular rooms of varying sizes connected by corridors
 */
export class BSPMazeStrategy implements MazeGeneratorStrategy {
  private readonly MIN_ROOM_SIZE = 5;
  private readonly MIN_PARTITION_SIZE = 8;
  private readonly ROOM_PADDING = 2; // Space between room and partition bounds

  *execute(params: MazeGeneratorParams): Generator<MazeStep, void, unknown> {
    const { width, height, offset } = params;

    // Create root partition encompassing entire grid
    const root: Rectangle = { x: 0, y: 0, width, height };

    // Recursively partition the space
    const partitions = this.partition(root);

    // Create rooms within each partition
    const rooms = partitions.map((partition) => this.createRoom(partition));

    // Carve out each room
    for (const room of rooms) {
      const cellsToCarve: Position[] = [];

      for (let row = room.y; row < room.y + room.height; row++) {
        for (let col = room.x; col < room.x + room.width; col++) {
          if (isWithinBounds(row, col, width, height)) {
            cellsToCarve.push({ row, col });
          }
        }
      }

      if (cellsToCarve.length > 0) {
        yield { cellsToCarve: cellsToCarve.map((pos) => applyOffset(pos, offset)) };
      }
    }

    // Connect adjacent rooms with corridors
    yield* this.connectRooms(rooms, width, height, offset);
  }

  /**
   * Recursively partitions a rectangle into smaller rectangles
   */
  private partition(rect: Rectangle): Rectangle[] {
    // Stop if the rectangle is too small to partition
    if (
      rect.width < this.MIN_PARTITION_SIZE * 2 ||
      rect.height < this.MIN_PARTITION_SIZE * 2
    ) {
      return [rect];
    }

    const partitions: Rectangle[] = [];
    const splitHorizontally = this.shouldSplitHorizontally(rect);

    if (splitHorizontally) {
      // Split horizontally
      const splitY = this.getRandomSplit(
        rect.y + this.MIN_PARTITION_SIZE,
        rect.y + rect.height - this.MIN_PARTITION_SIZE
      );

      const top: Rectangle = {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: splitY - rect.y,
      };

      const bottom: Rectangle = {
        x: rect.x,
        y: splitY,
        width: rect.width,
        height: rect.y + rect.height - splitY,
      };

      partitions.push(...this.partition(top), ...this.partition(bottom));
    } else {
      // Split vertically
      const splitX = this.getRandomSplit(
        rect.x + this.MIN_PARTITION_SIZE,
        rect.x + rect.width - this.MIN_PARTITION_SIZE
      );

      const left: Rectangle = {
        x: rect.x,
        y: rect.y,
        width: splitX - rect.x,
        height: rect.height,
      };

      const right: Rectangle = {
        x: splitX,
        y: rect.y,
        width: rect.x + rect.width - splitX,
        height: rect.height,
      };

      partitions.push(...this.partition(left), ...this.partition(right));
    }

    return partitions;
  }

  /**
   * Determines whether to split horizontally or vertically
   */
  private shouldSplitHorizontally(rect: Rectangle): boolean {
    const aspectRatio = rect.width / rect.height;

    // If too wide, split vertically; if too tall, split horizontally
    if (aspectRatio > 1.25) {
      return false; // Split vertically
    } else if (aspectRatio < 0.75) {
      return true; // Split horizontally
    }

    // Otherwise, random choice
    return Math.random() < 0.5;
  }

  /**
   * Gets a random split position between min and max
   */
  private getRandomSplit(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Creates a room within a partition with some padding
   */
  private createRoom(partition: Rectangle): Rectangle {
    const maxRoomWidth = partition.width - this.ROOM_PADDING * 2;
    const maxRoomHeight = partition.height - this.ROOM_PADDING * 2;

    const roomWidth = Math.max(
      this.MIN_ROOM_SIZE,
      Math.floor(Math.random() * (maxRoomWidth - this.MIN_ROOM_SIZE + 1)) + this.MIN_ROOM_SIZE
    );

    const roomHeight = Math.max(
      this.MIN_ROOM_SIZE,
      Math.floor(Math.random() * (maxRoomHeight - this.MIN_ROOM_SIZE + 1)) + this.MIN_ROOM_SIZE
    );

    const roomX =
      partition.x +
      this.ROOM_PADDING +
      Math.floor(Math.random() * (maxRoomWidth - roomWidth + 1));

    const roomY =
      partition.y +
      this.ROOM_PADDING +
      Math.floor(Math.random() * (maxRoomHeight - roomHeight + 1));

    return {
      x: roomX,
      y: roomY,
      width: roomWidth,
      height: roomHeight,
    };
  }

  /**
   * Connects rooms with corridors
   */
  private *connectRooms(
    rooms: Rectangle[],
    width: number,
    height: number,
    offset: Position
  ): Generator<MazeStep, void, unknown> {
    // Connect each room to the next one
    for (let i = 0; i < rooms.length - 1; i++) {
      const room1 = rooms[i];
      const room2 = rooms[i + 1];

      // Get centers of rooms
      const center1 = this.getRoomCenter(room1);
      const center2 = this.getRoomCenter(room2);

      // Create L-shaped corridor
      const corridorCells = this.createLCorridor(center1, center2, width, height);

      if (corridorCells.length > 0) {
        yield { cellsToCarve: corridorCells.map((pos) => applyOffset(pos, offset)) };
      }
    }
  }

  /**
   * Gets the center point of a room
   */
  private getRoomCenter(room: Rectangle): Position {
    return {
      row: Math.floor(room.y + room.height / 2),
      col: Math.floor(room.x + room.width / 2),
    };
  }

  /**
   * Creates an L-shaped corridor between two points
   */
  private createLCorridor(
    from: Position,
    to: Position,
    width: number,
    height: number
  ): Position[] {
    const corridor: Position[] = [];

    // Random choice: horizontal first or vertical first
    const horizontalFirst = Math.random() < 0.5;

    if (horizontalFirst) {
      // Horizontal then vertical
      const minCol = Math.min(from.col, to.col);
      const maxCol = Math.max(from.col, to.col);

      for (let col = minCol; col <= maxCol; col++) {
        if (isWithinBounds(from.row, col, width, height)) {
          corridor.push({ row: from.row, col });
        }
      }

      const minRow = Math.min(from.row, to.row);
      const maxRow = Math.max(from.row, to.row);

      for (let row = minRow; row <= maxRow; row++) {
        if (isWithinBounds(row, to.col, width, height)) {
          corridor.push({ row, col: to.col });
        }
      }
    } else {
      // Vertical then horizontal
      const minRow = Math.min(from.row, to.row);
      const maxRow = Math.max(from.row, to.row);

      for (let row = minRow; row <= maxRow; row++) {
        if (isWithinBounds(row, from.col, width, height)) {
          corridor.push({ row, col: from.col });
        }
      }

      const minCol = Math.min(from.col, to.col);
      const maxCol = Math.max(from.col, to.col);

      for (let col = minCol; col <= maxCol; col++) {
        if (isWithinBounds(to.row, col, width, height)) {
          corridor.push({ row: to.row, col });
        }
      }
    }

    return corridor;
  }
}
