import { MinBinaryHeap } from '@/core/data-structures/min-heap';
import type { GridNodeData } from '@/types/grid-node';
import { PathBuilder } from './path-builder';
import { isTargetNode } from './helpers';
import type { Distance2DStrategy } from '@/core/distance/distance-2d.strategy';

export class AStarAlgorithm {
  solve(
    start: GridNodeData,
    end: GridNodeData,
    getAdjacentNodes: (node: GridNodeData) => GridNodeData[],
    distanceStrategy: Distance2DStrategy
  ): { visited: GridNodeData[]; path: GridNodeData[]; found: boolean } {
    const visitedNodes: GridNodeData[] = [];
    const heap = new MinBinaryHeap<GridNodeData>('totalCost');

    // Initialize start node
    start.costFromStart = 0;
    start.heuristicToEnd = distanceStrategy.calculate(start, end);
    start.totalCost = start.costFromStart + start.heuristicToEnd;
    heap.insert(start);

    while (!heap.isEmpty()) {
      const current = heap.extractMin();

      if (isTargetNode(current, end)) {
        return { visited: visitedNodes, path: PathBuilder.buildPath(current), found: true };
      }

      visitedNodes.push(current);

      const adjacentNodes = getAdjacentNodes(current);

      for (const node of adjacentNodes) {
        const distance = distanceStrategy.calculate(current, node);
        const newCost = current.costFromStart + distance;

        if (newCost < node.costFromStart) {
          node.costFromStart = newCost;
          node.heuristicToEnd = distanceStrategy.calculate(node, end);
          node.totalCost = node.costFromStart + node.heuristicToEnd;
          node.parent = current;
          heap.insert(node);
        }
      }
    }

    return { visited: visitedNodes, path: [], found: false };
  }
}
