import type { GridNodeData } from '@/types/grid-node';
import { PathBuilder } from './path-builder';
import { isTargetNode } from './helpers';

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

    // Mark start as visited before beginning DFS
    this.visitedNodes.push(start);

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
    if (isTargetNode(current, end)) {
      this.solutionPath = PathBuilder.buildPath(current);
      return true;
    }

    const adjacentNodes = getAdjacentNodes(current);

    // Randomize order for more interesting visual exploration
    adjacentNodes.sort(() => Math.random() - 0.5);

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
