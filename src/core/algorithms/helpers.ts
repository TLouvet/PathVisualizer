import { type GridNodeData, PathOption } from '../../types/grid-node';
import { ManhattanDistance } from '../distance/ManhattanDistance';
import { EuclidianDistance } from '../distance/EuclidianDistance';

export function getAdjacentNodes4Direction(grid: GridNodeData[][], current: GridNodeData): GridNodeData[] {
  const { row, col } = current;
  const height = grid.length;
  const width = grid[0].length;
  const adjacent: GridNodeData[] = [];

  // Left
  if (col > 0) {
    const node = grid[row][col - 1];
    if (isValidNode(node)) adjacent.push(node);
  }

  // Right
  if (col < width - 1) {
    const node = grid[row][col + 1];
    if (isValidNode(node)) adjacent.push(node);
  }

  // Top
  if (row > 0) {
    const node = grid[row - 1][col];
    if (isValidNode(node)) adjacent.push(node);
  }

  // Bottom
  if (row < height - 1) {
    const node = grid[row + 1][col];
    if (isValidNode(node)) adjacent.push(node);
  }

  return adjacent;
}

export function getAdjacentNodes8Direction(grid: GridNodeData[][], current: GridNodeData): GridNodeData[] {
  const { row, col } = current;
  const height = grid.length;
  const width = grid[0].length;
  const adjacent: GridNodeData[] = [];

  // 4 cardinal directions
  const hasLeft = col > 0;
  const hasRight = col < width - 1;
  const hasTop = row > 0;
  const hasBottom = row < height - 1;

  if (hasLeft) {
    const node = grid[row][col - 1];
    if (isValidNode(node)) adjacent.push(node);
  }

  if (hasRight) {
    const node = grid[row][col + 1];
    if (isValidNode(node)) adjacent.push(node);
  }

  if (hasTop) {
    const node = grid[row - 1][col];
    if (isValidNode(node)) adjacent.push(node);
  }

  if (hasBottom) {
    const node = grid[row + 1][col];
    if (isValidNode(node)) adjacent.push(node);
  }

  // Diagonals
  if (hasLeft && hasTop) {
    const node = grid[row - 1][col - 1];
    if (isValidNode(node)) adjacent.push(node);
  }

  if (hasRight && hasTop) {
    const node = grid[row - 1][col + 1];
    if (isValidNode(node)) adjacent.push(node);
  }

  if (hasLeft && hasBottom) {
    const node = grid[row + 1][col - 1];
    if (isValidNode(node)) adjacent.push(node);
  }

  if (hasRight && hasBottom) {
    const node = grid[row + 1][col + 1];
    if (isValidNode(node)) adjacent.push(node);
  }

  return adjacent;
}

function isValidNode(node: GridNodeData): boolean {
  return (
    node.state === PathOption.NONE ||
    node.state === PathOption.END ||
    node.state === PathOption.VISITED ||
    node.state === PathOption.SOLUTION
  );
}

const manhattanDistance = new ManhattanDistance();
const euclidianDistance = new EuclidianDistance();

export function getManhattanDistance(a: GridNodeData, b: GridNodeData): number {
  return manhattanDistance.calculate({ row: a.row, col: a.col }, { row: b.row, col: b.col });
}

export function getEuclidianDistance(a: GridNodeData, b: GridNodeData): number {
  return euclidianDistance.calculate({ row: a.row, col: a.col }, { row: b.row, col: b.col });
}
