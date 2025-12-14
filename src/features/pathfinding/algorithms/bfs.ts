import type { GridNodeData } from '@/types/grid-node';
import { PathBuilder } from './path-builder';
import { Queue } from '@/core/data-structures/queue';
import { isTargetNode } from './helpers';

export class BFSAlgorithm {
  solve(
    start: GridNodeData,
    end: GridNodeData,
    getAdjacentNodes: (node: GridNodeData) => GridNodeData[]
  ): { visited: GridNodeData[]; path: GridNodeData[]; found: boolean } {
    const visitedNodes: GridNodeData[] = [];
    const queue = new Queue<GridNodeData>();
    const visited = new Set<string>();

    queue.enqueue(start);
    visited.add(`${start.row}-${start.col}`);

    while (!queue.isEmpty()) {
      const current = queue.dequeue()!;

      if (isTargetNode(current, end)) {
        return { visited: visitedNodes, path: PathBuilder.buildPath(current), found: true };
      }

      const adjacentNodes = getAdjacentNodes(current);

      for (const node of adjacentNodes) {
        this.visitNode(node, current, visited, visitedNodes, queue);
      }
    }

    return { visited: visitedNodes, path: [], found: false };
  }

  private visitNode(
    node: GridNodeData,
    current: GridNodeData,
    visited: Set<string>,
    visitedNodes: GridNodeData[],
    queue: Queue<GridNodeData>
  ): void {
    const key = `${node.row}-${node.col}`;
    if (visited.has(key)) return;

    visited.add(key);
    node.parent = current;
    visitedNodes.push(node);
    queue.enqueue(node);
  }
}
