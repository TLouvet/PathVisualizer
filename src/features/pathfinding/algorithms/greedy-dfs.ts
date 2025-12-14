import type { GridNodeData } from '@/types/grid-node';
import { PathBuilder } from './path-builder';
import { isTargetNode } from './helpers';
import type { Distance2DStrategy } from '@/core/distance/distance-2d.strategy';

export class GreedyDFSAlgorithm {
  private visitedNodes: GridNodeData[] = [];
  private solutionPath: GridNodeData[] = [];

  solve(
    start: GridNodeData,
    end: GridNodeData,
    getAdjacentNodes: (node: GridNodeData) => GridNodeData[],
    distanceStrategy: Distance2DStrategy
  ): { visited: GridNodeData[]; path: GridNodeData[]; found: boolean } {
    this.visitedNodes = [];
    this.solutionPath = [];

    const found = this.dfs(start, end, getAdjacentNodes, distanceStrategy);

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
    distanceStrategy: Distance2DStrategy
  ): boolean {
    if (isTargetNode(current, end)) {
      this.solutionPath = PathBuilder.buildPath(current);
      return true;
    }

    const adjacentNodes = getAdjacentNodes(current);

    // Sort by distance to target, with random ordering for equal distances
    const sortedNodes = adjacentNodes
      .map((node) => ({
        node,
        distance: distanceStrategy.calculate(node, end),
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

        if (this.dfs(node, end, getAdjacentNodes, distanceStrategy)) {
          return true;
        }
      }
    }

    return false;
  }
}
