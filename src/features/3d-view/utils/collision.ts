import { PathOption, type GridNodeData } from '@/types/grid-node';

/**
 * Check if a position is valid and walkable in the grid
 */
export function isPositionWalkable(
  x: number,
  y: number,
  gridWidth: number,
  gridHeight: number,
  node: GridNodeData | null
): boolean {
  const col = Math.floor(x);
  const row = Math.floor(y);

  // Check bounds
  if (col < 0 || col >= gridWidth || row < 0 || row >= gridHeight) {
    return false;
  }

  // Check if node exists and is not a wall
  if (!node) return false;

  return node.state !== PathOption.WALL;
}
