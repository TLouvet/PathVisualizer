import { type GridNodeData } from '../../types/grid-node';
import { MinBinaryHeap } from '../data-structures/min-heap';

export class DijkstraAlgorithm {
  solve(
    start: GridNodeData,
    end: GridNodeData,
    getAdjacentNodes: (node: GridNodeData) => GridNodeData[],
    getDistance: (a: GridNodeData, b: GridNodeData) => number
  ): { visited: GridNodeData[]; path: GridNodeData[]; found: boolean } {
    const visitedNodes: GridNodeData[] = [];
    const heap = new MinBinaryHeap<GridNodeData>('costFromStart');

    // Reset costs
    start.costFromStart = 0;
    heap.insert(start);

    while (!heap.isEmpty()) {
      const current = heap.extractMin();

      if (current.row === end.row && current.col === end.col) {
        // Build solution path
        const path: GridNodeData[] = [];
        let node: GridNodeData | null = current;
        while (node) {
          path.unshift(node);
          node = node.parent;
        }
        return { visited: visitedNodes, path, found: true };
      }

      visitedNodes.push(current);

      const adjacentNodes = getAdjacentNodes(current);

      for (const node of adjacentNodes) {
        const distance = getDistance(current, node);
        const newCost = current.costFromStart + distance;

        if (newCost < node.costFromStart) {
          node.costFromStart = newCost;
          node.parent = current;
          heap.insert(node);
        }
      }
    }

    return { visited: visitedNodes, path: [], found: false };
  }
}
