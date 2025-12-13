import { type GridNodeData } from '../../types/grid-node';

export class GreedyDFSAlgorithm {
  private visitedNodes: GridNodeData[] = [];
  private solutionPath: GridNodeData[] = [];

  solve(
    start: GridNodeData,
    end: GridNodeData,
    getAdjacentNodes: (node: GridNodeData) => GridNodeData[],
    getDistance: (a: GridNodeData, b: GridNodeData) => number
  ): { visited: GridNodeData[]; path: GridNodeData[]; found: boolean } {
    this.visitedNodes = [];
    this.solutionPath = [];

    const found = this.dfs(start, end, getAdjacentNodes, getDistance);

    return {
      visited: this.visitedNodes,
      path: this.solutionPath,
      found,
    };
  }

  private dfs(
    current: GridNodeData,
    end: GridNodeData,
    getAdjacentNodes: (node: GridNodeData) => GridNodeData[],
    getDistance: (a: GridNodeData, b: GridNodeData) => number
  ): boolean {
    if (current.row === end.row && current.col === end.col) {
      // Build solution path
      let node: GridNodeData | null = current;
      while (node) {
        this.solutionPath.unshift(node);
        node = node.parent;
      }
      return true;
    }

    const adjacentNodes = getAdjacentNodes(current);

    // Sort by distance to target, with random ordering for equal distances
    const sortedNodes = adjacentNodes
      .map((node) => ({
        node,
        distance: getDistance(node, end),
        random: Math.random(),
      }))
      .sort((a, b) => {
        // Sort by distance first
        if (a.distance !== b.distance) {
          return a.distance - b.distance;
        }
        // If distances are equal, sort by random value
        return a.random - b.random;
      })
      .map((item) => item.node);

    for (const node of sortedNodes) {
      if (!this.visitedNodes.find((v) => v.row === node.row && v.col === node.col)) {
        node.parent = current;
        this.visitedNodes.push(node);

        if (this.dfs(node, end, getAdjacentNodes, getDistance)) {
          return true;
        }
      }
    }

    return false;
  }
}
