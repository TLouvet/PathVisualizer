/**
 * Utility functions shared across maze generation algorithms.
 * These handle the common geometric and grid operations that all maze generators need.
 */

export interface Position {
  row: number;
  col: number;
}

export interface Direction {
  dr: number;
  dc: number;
}

/**
 * Cardinal directions with step of 2 (leaves walls between passages).
 * Used by all maze algorithms to maintain consistent wall spacing.
 */
export const MAZE_DIRECTIONS: Direction[] = [
  { dr: -2, dc: 0 }, // up
  { dr: 0, dc: 2 },  // right
  { dr: 2, dc: 0 },  // down
  { dr: 0, dc: -2 }, // left
];

/**
 * Checks if a position is within the grid bounds.
 */
export const isWithinBounds = (row: number, col: number, width: number, height: number): boolean => {
  return row >= 0 && row < height && col >= 0 && col < width;
};

/**
 * Generates a random odd position within the grid.
 * We use odd positions to ensure proper wall spacing in the maze.
 */
export const getRandomOddPosition = (width: number, height: number): Position => {
  const row = Math.floor(Math.random() * Math.floor(height / 2)) * 2 + 1;
  const col = Math.floor(Math.random() * Math.floor(width / 2)) * 2 + 1;
  return { row, col };
};

/**
 * Creates a unique key for a cell position.
 * Used for Set-based visited tracking.
 */
export const getCellKey = (row: number, col: number): string => {
  return `${row},${col}`;
};

/**
 * Calculates the wall position between two cells.
 * The wall is always at the midpoint.
 */
export const getWallPosition = (from: Position, to: Position): Position => {
  return {
    row: (from.row + to.row) / 2,
    col: (from.col + to.col) / 2,
  };
};

/**
 * Applies an offset to a position.
 * Used when rendering with borders or custom grid offsets.
 */
export const applyOffset = (pos: Position, offset: Position): Position => {
  return {
    row: pos.row + offset.row,
    col: pos.col + offset.col,
  };
};
