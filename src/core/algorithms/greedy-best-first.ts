import { type GridNodeData } from '../../types/grid-node';
import { MinBinaryHeap } from '../data-structures/min-heap';

export class GreedyBestFirstAlgorithm {
  solve(
    start: GridNodeData,
    end: GridNodeData,
    getAdjacentNodes: (node: GridNodeData) => GridNodeData[],
    getDistance: (a: GridNodeData, b: GridNodeData) => number
  ): { visited: GridNodeData[]; path: GridNodeData[]; found: boolean } {
    const visitedNodes: GridNodeData[] = [];
    const heap = new MinBinaryHeap<GridNodeData>('heuristicToEnd');

    // Initialize start node with heuristic only
    start.heuristicToEnd = getDistance(start, end);
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
        // Only visit each node once (greedy = no re-evaluation)
        if (!visitedNodes.find((v) => v.row === node.row && v.col === node.col)) {
          node.heuristicToEnd = getDistance(node, end);
          node.parent = current;
          heap.insert(node);
        }
      }
    }

    return { visited: visitedNodes, path: [], found: false };
  }
}
