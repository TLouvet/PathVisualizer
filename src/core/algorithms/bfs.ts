import { type GridNodeData } from '../../types/grid-node';

export class BFSAlgorithm {
  solve(
    start: GridNodeData,
    end: GridNodeData,
    getAdjacentNodes: (node: GridNodeData) => GridNodeData[]
  ): { visited: GridNodeData[]; path: GridNodeData[]; found: boolean } {
    const visitedNodes: GridNodeData[] = [];
    const queue: GridNodeData[] = [start];
    const visited = new Set<string>();
    visited.add(`${start.row}-${start.col}`);

    while (queue.length > 0) {
      const current = queue.shift()!;

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

      const adjacentNodes = getAdjacentNodes(current);

      for (const node of adjacentNodes) {
        const key = `${node.row}-${node.col}`;
        if (!visited.has(key)) {
          visited.add(key);
          node.parent = current;
          visitedNodes.push(node);
          queue.push(node);
        }
      }
    }

    return { visited: visitedNodes, path: [], found: false };
  }
}
