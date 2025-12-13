import { type GridNodeData, PathOption } from '../../types/grid-node';
import { MinBinaryHeap } from '../data-structures/min-heap';

export class JumpPointSearchAlgorithm {
  private grid!: GridNodeData[][];
  private end!: GridNodeData;
  private visitedNodes!: GridNodeData[];

  solve(
    grid: GridNodeData[][],
    start: GridNodeData,
    end: GridNodeData,
    getDistance: (a: GridNodeData, b: GridNodeData) => number
  ): { visited: GridNodeData[]; path: GridNodeData[]; found: boolean } {
    this.grid = grid;
    this.end = end;
    this.visitedNodes = [];

    const heap = new MinBinaryHeap<GridNodeData>('totalCost');

    // Initialize start node
    start.costFromStart = 0;
    start.heuristicToEnd = getDistance(start, end);
    start.totalCost = start.costFromStart + start.heuristicToEnd;
    heap.insert(start);

    const closedSet = new Set<string>();

    while (!heap.isEmpty()) {
      const current = heap.extractMin();
      const currentKey = `${current.row},${current.col}`;

      if (closedSet.has(currentKey)) continue;
      closedSet.add(currentKey);

      if (current.row === end.row && current.col === end.col) {
        // Build solution path
        const path: GridNodeData[] = [];
        let node: GridNodeData | null = current;
        while (node) {
          path.unshift(node);
          node = node.parent;
        }
        return { visited: this.visitedNodes, path, found: true };
      }

      this.visitedNodes.push(current);

      // Find jump points in all directions
      const successors = this.getSuccessors(current);

      for (const successor of successors) {
        const successorKey = `${successor.row},${successor.col}`;
        if (closedSet.has(successorKey)) continue;

        const distance = getDistance(current, successor);
        const newCost = current.costFromStart + distance;

        if (newCost < successor.costFromStart) {
          successor.costFromStart = newCost;
          successor.heuristicToEnd = getDistance(successor, end);
          successor.totalCost = successor.costFromStart + successor.heuristicToEnd;
          successor.parent = current;
          heap.insert(successor);
        }
      }
    }

    return { visited: this.visitedNodes, path: [], found: false };
  }

  private getSuccessors(node: GridNodeData): GridNodeData[] {
    const successors: GridNodeData[] = [];
    const neighbors = this.findNeighbors(node);

    for (const neighbor of neighbors) {
      const jumpPoint = this.jump(neighbor.row, neighbor.col, node.row, node.col);
      if (jumpPoint) {
        successors.push(this.grid[jumpPoint.row][jumpPoint.col]);
      }
    }

    return successors;
  }

  private findNeighbors(node: GridNodeData): GridNodeData[] {
    const parent = node.parent;
    const neighbors: GridNodeData[] = [];

    // If no parent, return all walkable neighbors
    if (!parent) {
      return this.getAllWalkableNeighbors(node);
    }

    const { row, col } = node;
    const dx = Math.sign(col - parent.col);
    const dy = Math.sign(row - parent.row);

    // Diagonal movement
    if (dx !== 0 && dy !== 0) {
      // Continue diagonally
      if (this.isWalkable(row, col + dx)) neighbors.push(this.grid[row][col + dx]);
      if (this.isWalkable(row + dy, col)) neighbors.push(this.grid[row + dy][col]);
      if (this.isWalkable(row + dy, col + dx)) neighbors.push(this.grid[row + dy][col + dx]);

      // Forced neighbors
      if (!this.isWalkable(row - dy, col) && this.isWalkable(row - dy, col + dx)) {
        neighbors.push(this.grid[row - dy][col + dx]);
      }
      if (!this.isWalkable(row, col - dx) && this.isWalkable(row + dy, col - dx)) {
        neighbors.push(this.grid[row + dy][col - dx]);
      }
    }
    // Horizontal movement
    else if (dx !== 0) {
      if (this.isWalkable(row, col + dx)) neighbors.push(this.grid[row][col + dx]);

      // Forced neighbors
      if (!this.isWalkable(row + 1, col) && this.isWalkable(row + 1, col + dx)) {
        neighbors.push(this.grid[row + 1][col + dx]);
      }
      if (!this.isWalkable(row - 1, col) && this.isWalkable(row - 1, col + dx)) {
        neighbors.push(this.grid[row - 1][col + dx]);
      }
    }
    // Vertical movement
    else if (dy !== 0) {
      if (this.isWalkable(row + dy, col)) neighbors.push(this.grid[row + dy][col]);

      // Forced neighbors
      if (!this.isWalkable(row, col + 1) && this.isWalkable(row + dy, col + 1)) {
        neighbors.push(this.grid[row + dy][col + 1]);
      }
      if (!this.isWalkable(row, col - 1) && this.isWalkable(row + dy, col - 1)) {
        neighbors.push(this.grid[row + dy][col - 1]);
      }
    }

    return neighbors;
  }

  private jump(row: number, col: number, parentRow: number, parentCol: number): { row: number; col: number } | null {
    if (!this.isWalkable(row, col)) return null;

    // Track this node as visited for visualization
    const currentNode = this.grid[row][col];
    if (!this.visitedNodes.some((v) => v.row === row && v.col === col)) {
      this.visitedNodes.push(currentNode);
    }

    // Reached the goal
    if (row === this.end.row && col === this.end.col) {
      return { row, col };
    }

    const dx = col - parentCol;
    const dy = row - parentRow;

    // Check for forced neighbors
    if (dx !== 0 && dy !== 0) {
      // Diagonal
      if (
        (this.isWalkable(row - dy, col + dx) && !this.isWalkable(row - dy, col)) ||
        (this.isWalkable(row + dy, col - dx) && !this.isWalkable(row, col - dx))
      ) {
        return { row, col };
      }

      // Check horizontal and vertical jumps
      if (this.jump(row + dy, col, row, col) || this.jump(row, col + dx, row, col)) {
        return { row, col };
      }
    } else {
      // Horizontal/Vertical
      if (dx !== 0) {
        if (
          (this.isWalkable(row + 1, col + dx) && !this.isWalkable(row + 1, col)) ||
          (this.isWalkable(row - 1, col + dx) && !this.isWalkable(row - 1, col))
        ) {
          return { row, col };
        }
      } else if (dy !== 0) {
        if (
          (this.isWalkable(row + dy, col + 1) && !this.isWalkable(row, col + 1)) ||
          (this.isWalkable(row + dy, col - 1) && !this.isWalkable(row, col - 1))
        ) {
          return { row, col };
        }
      }
    }

    // Continue jumping in the same direction
    return this.jump(row + dy, col + dx, row, col);
  }

  private getAllWalkableNeighbors(node: GridNodeData): GridNodeData[] {
    const { row, col } = node;
    const neighbors: GridNodeData[] = [];

    // 8 directions
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1], // Cardinal
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1], // Diagonal
    ];

    for (const [dy, dx] of directions) {
      const newRow = row + dy;
      const newCol = col + dx;
      if (this.isWalkable(newRow, newCol)) {
        neighbors.push(this.grid[newRow][newCol]);
      }
    }

    return neighbors;
  }

  private isWalkable(row: number, col: number): boolean {
    if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[0].length) {
      return false;
    }

    const node = this.grid[row][col];
    return (
      node.state === PathOption.NONE ||
      node.state === PathOption.END ||
      node.state === PathOption.VISITED ||
      node.state === PathOption.SOLUTION
    );
  }
}
