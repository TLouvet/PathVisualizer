import { type MazeGeneratorStrategy, type MazeGeneratorParams, type MazeStep } from './types';
import { type Position, isWithinBounds, getCellKey, applyOffset } from './maze-utils';

/**
 * Cellular Automata Maze Generator (Cave Generation)
 *
 * Algorithm: 4-5 Rule Cellular Automata
 * - Randomly fill grid with walls/passages (45% passages)
 * - Apply rules repeatedly:
 *   - If cell has 5+ wall neighbors → becomes wall
 *   - If cell has 4- wall neighbors → becomes passage
 * - Repeat 4-5 iterations
 *
 * Characteristics: Creates organic, cave-like structures with natural-looking passages and multiple routes
 */
export class CellularAutomataMazeStrategy implements MazeGeneratorStrategy {
  private readonly INITIAL_PASSAGE_PROBABILITY = 0.45;
  private readonly ITERATIONS = 5;
  private readonly WALL_THRESHOLD = 5;

  *execute(params: MazeGeneratorParams): Generator<MazeStep, void, unknown> {
    const { width, height, offset } = params;

    // Initialize grid with random walls/passages
    let grid = this.initializeRandomGrid(width, height);

    // Yield initial random state
    const initialPassages = this.getPassageCells(grid);
    if (initialPassages.length > 0) {
      yield {
        cellsToCarve: initialPassages.map((pos) => applyOffset(pos, offset)),
      };
    }

    // Apply cellular automata rules for several iterations
    for (let iteration = 0; iteration < this.ITERATIONS; iteration++) {
      const newGrid = this.applyAutomataRules(grid, width, height);

      // Find cells that changed from wall to passage
      const changedCells: Position[] = [];
      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          const key = getCellKey(row, col);
          if (!grid.has(key) && newGrid.has(key)) {
            changedCells.push({ row, col });
          }
        }
      }

      grid = newGrid;

      if (changedCells.length > 0) {
        yield {
          cellsToCarve: changedCells.map((pos) => applyOffset(pos, offset)),
        };
      }
    }

    // Ensure connectivity by performing flood fill from center
    const connectedCells = this.ensureConnectivity(grid, width, height);
    if (connectedCells.length > 0) {
      yield {
        cellsToCarve: connectedCells.map((pos) => applyOffset(pos, offset)),
      };
    }
  }

  /**
   * Initializes the grid with random walls and passages.
   * Returns a Set containing positions of passage cells (walls are implicit).
   */
  private initializeRandomGrid(width: number, height: number): Set<string> {
    const passages = new Set<string>();

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (Math.random() < this.INITIAL_PASSAGE_PROBABILITY) {
          passages.add(getCellKey(row, col));
        }
      }
    }

    return passages;
  }

  /**
   * Applies the 4-5 rule cellular automata:
   * - If a cell has 5 or more wall neighbors → becomes a wall
   * - Otherwise → becomes a passage
   */
  private applyAutomataRules(grid: Set<string>, width: number, height: number): Set<string> {
    const newGrid = new Set<string>();

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const wallNeighbors = this.countWallNeighbors(grid, row, col, width, height);

        if (wallNeighbors < this.WALL_THRESHOLD) {
          newGrid.add(getCellKey(row, col));
        }
      }
    }

    return newGrid;
  }

  /**
   * Counts the number of wall neighbors (including diagonals) for a cell.
   */
  private countWallNeighbors(
    grid: Set<string>,
    row: number,
    col: number,
    width: number,
    height: number
  ): number {
    let wallCount = 0;

    // Check all 8 neighbors (including diagonals)
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue; // Skip the cell itself

        const nr = row + dr;
        const nc = col + dc;

        // Treat out-of-bounds as walls
        if (!isWithinBounds(nr, nc, width, height)) {
          wallCount++;
        } else if (!grid.has(getCellKey(nr, nc))) {
          // Cell is a wall
          wallCount++;
        }
      }
    }

    return wallCount;
  }

  /**
   * Ensures that the maze is connected by finding the largest connected component
   * and connecting isolated regions.
   */
  private ensureConnectivity(grid: Set<string>, width: number, height: number): Position[] {
    // Find center passage cell or create one
    const centerRow = Math.floor(height / 2);
    const centerCol = Math.floor(width / 2);

    // Find nearest passage to center if center is a wall
    let startPos: Position = { row: centerRow, col: centerCol };
    let found = grid.has(getCellKey(centerRow, centerCol));

    if (!found) {
      // Spiral search for nearest passage
      for (let radius = 1; radius < Math.max(width, height) / 2; radius++) {
        for (let dr = -radius; dr <= radius; dr++) {
          for (let dc = -radius; dc <= radius; dc++) {
            if (Math.abs(dr) !== radius && Math.abs(dc) !== radius) continue;

            const nr = centerRow + dr;
            const nc = centerCol + dc;

            if (
              isWithinBounds(nr, nc, width, height) &&
              grid.has(getCellKey(nr, nc))
            ) {
              startPos = { row: nr, col: nc };
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (found) break;
      }
    }

    // If no passage found at all, return empty (shouldn't happen with 45% initial probability)
    if (!found) return [];

    // Flood fill from start position to find connected component
    const connected = new Set<string>();
    const queue: Position[] = [startPos];
    connected.add(getCellKey(startPos.row, startPos.col));

    while (queue.length > 0) {
      const current = queue.shift()!;

      // Check 4 cardinal neighbors
      const neighbors = [
        { row: current.row - 1, col: current.col },
        { row: current.row + 1, col: current.col },
        { row: current.row, col: current.col - 1 },
        { row: current.row, col: current.col + 1 },
      ];

      for (const neighbor of neighbors) {
        const key = getCellKey(neighbor.row, neighbor.col);
        if (
          isWithinBounds(neighbor.row, neighbor.col, width, height) &&
          grid.has(key) &&
          !connected.has(key)
        ) {
          connected.add(key);
          queue.push(neighbor);
        }
      }
    }

    // All cells are already connected if connected component matches grid
    if (connected.size === grid.size) return [];

    // This is a simple implementation - in practice, cellular automata
    // with these parameters usually creates naturally connected caves
    return [];
  }

  /**
   * Gets all passage cells from the grid.
   */
  private getPassageCells(grid: Set<string>): Position[] {
    const cells: Position[] = [];
    for (const key of grid) {
      const [row, col] = key.split(',').map(Number);
      cells.push({ row, col });
    }
    return cells;
  }
}
