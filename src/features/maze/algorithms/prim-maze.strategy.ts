import { type MazeGeneratorStrategy, type MazeGeneratorParams, type MazeStep } from './types';
import {
  type Position,
  MAZE_DIRECTIONS,
  isWithinBounds,
  getRandomOddPosition,
  getCellKey,
  getWallPosition,
  applyOffset,
} from './maze-utils';

interface Wall extends Position {
  from: Position;
}

/**
 * Prim's Maze Generator
 *
 * Algorithm: Randomized Prim's algorithm
 * - Start with a random cell and add its walls to a frontier list
 * - Pick a random wall from the frontier
 * - If the cell on the other side isn't in the maze yet, carve through and add it
 * - Add the new cell's walls to the frontier
 * - Continue until the frontier is empty
 *
 * Characteristics: Creates more uniform mazes with shorter, more branching passages
 */
export class PrimMazeStrategy implements MazeGeneratorStrategy {
  *execute(params: MazeGeneratorParams): Generator<MazeStep, void, unknown> {
    const { width, height, offset } = params;

    const visited = new Set<string>();
    const frontierWalls: Wall[] = [];

    // Initialize with random starting position
    const start = getRandomOddPosition(width, height);
    visited.add(getCellKey(start.row, start.col));
    yield { cellsToCarve: [applyOffset(start, offset)] };

    this.addWallsToFrontier(start, frontierWalls, visited, width, height);

    // Continue until we've explored all frontiers
    while (frontierWalls.length > 0) {
      const wall = this.pickRandomWall(frontierWalls);
      const wallKey = getCellKey(wall.row, wall.col);

      if (!visited.has(wallKey) && isWithinBounds(wall.row, wall.col, width, height)) {
        // Carve through to the new cell
        visited.add(wallKey);
        const wallBetween = getWallPosition(wall.from, wall);

        yield {
          cellsToCarve: [applyOffset(wall, offset), applyOffset(wallBetween, offset)],
        };

        this.addWallsToFrontier(wall, frontierWalls, visited, width, height);
      }
    }
  }

  /**
   * Picks and removes a random wall from the frontier.
   */
  private pickRandomWall(frontierWalls: Wall[]): Wall {
    const randomIndex = Math.floor(Math.random() * frontierWalls.length);
    const wall = frontierWalls[randomIndex];
    frontierWalls.splice(randomIndex, 1);
    return wall;
  }

  /**
   * Adds all unvisited neighboring walls to the frontier list.
   */
  private addWallsToFrontier(
    cell: Position,
    frontierWalls: Wall[],
    visited: Set<string>,
    width: number,
    height: number
  ): void {
    for (const dir of MAZE_DIRECTIONS) {
      const neighbor: Position = { row: cell.row + dir.dr, col: cell.col + dir.dc };
      const neighborKey = getCellKey(neighbor.row, neighbor.col);

      if (isWithinBounds(neighbor.row, neighbor.col, width, height) && !visited.has(neighborKey)) {
        frontierWalls.push({ ...neighbor, from: cell });
      }
    }
  }
}
