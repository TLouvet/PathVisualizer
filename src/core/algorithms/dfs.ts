import { type GridNodeData } from '../../types/grid-node';

export class DFSAlgorithm {
  private visitedNodes: GridNodeData[] = [];
  private solutionPath: GridNodeData[] = [];

  solve(
    start: GridNodeData,
    end: GridNodeData,
    getAdjacentNodes: (node: GridNodeData) => GridNodeData[]
  ): { visited: GridNodeData[]; path: GridNodeData[]; found: boolean } {
    this.visitedNodes = [];
    this.solutionPath = [];

    const found = this.dfs(start, end, getAdjacentNodes);

    return {
      visited: this.visitedNodes,
      path: this.solutionPath,
      found,
    };
  }

  private dfs(
    current: GridNodeData,
    end: GridNodeData,
    getAdjacentNodes: (node: GridNodeData) => GridNodeData[]
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

    for (const node of adjacentNodes) {
      if (!this.visitedNodes.find((v) => v.row === node.row && v.col === node.col)) {
        node.parent = current;
        this.visitedNodes.push(node);

        if (this.dfs(node, end, getAdjacentNodes)) {
          return true;
        }
      }
    }

    return false;
  }
}
