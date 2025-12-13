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
import { shuffleArray } from '@/shared/lib/array';
import { Stack } from '@/core/data-structures/stack';

/**
 * DFS (Depth-First Search) Maze Generator
 *
 * Algorithm: Randomized recursive backtracker
 * - Start at a random cell and mark it as visited
 * - Pick a random unvisited neighbor, carve the wall between them, and move to it
 * - If no unvisited neighbors exist, backtrack to the previous cell
 * - Continue until all cells are visited
 *
 * Characteristics: Creates long, winding corridors with few branches
 */
export class DFSMazeStrategy implements MazeGeneratorStrategy {
  *execute(params: MazeGeneratorParams): Generator<MazeStep, void, unknown> {
    const { width, height, offset } = params;

    const visited = new Set<string>();
    const pathStack = new Stack<Position>();

    // Initialize with random starting position
    const start = getRandomOddPosition(width, height);
    pathStack.push(start);
    visited.add(getCellKey(start.row, start.col));
    yield { cellsToCarve: [applyOffset(start, offset)] };

    // Continue until we've backtracked to the start
    while (!pathStack.isEmpty()) {
      const current = pathStack.peek()!;
      const unvisitedNeighbor = this.findUnvisitedNeighbor(current, visited, width, height);

      if (unvisitedNeighbor) {
        // Carve path to unvisited neighbor
        visited.add(getCellKey(unvisitedNeighbor.row, unvisitedNeighbor.col));
        const wall = getWallPosition(current, unvisitedNeighbor);

        yield {
          cellsToCarve: [applyOffset(unvisitedNeighbor, offset), applyOffset(wall, offset)],
        };

        pathStack.push(unvisitedNeighbor);
      } else {
        // No unvisited neighbors, backtrack
        pathStack.pop();
      }
    }
  }

  /**
   * Finds a random unvisited neighbor of the current position.
   * Returns null if all neighbors have been visited.
   */
  private findUnvisitedNeighbor(
    current: Position,
    visited: Set<string>,
    width: number,
    height: number
  ): Position | null {
    const shuffledDirections = shuffleArray(MAZE_DIRECTIONS);

    for (const dir of shuffledDirections) {
      const neighbor: Position = { row: current.row + dir.dr, col: current.col + dir.dc };
      const key = getCellKey(neighbor.row, neighbor.col);

      if (isWithinBounds(neighbor.row, neighbor.col, width, height) && !visited.has(key)) {
        return neighbor;
      }
    }

    return null;
  }
}
