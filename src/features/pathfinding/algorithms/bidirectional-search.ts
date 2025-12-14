import type { GridNodeData } from '@/types/grid-node';
import { PathBuilder } from './path-builder';

export class BidirectionalSearchAlgorithm {
  solve(
    start: GridNodeData,
    end: GridNodeData,
    getAdjacentNodes: (node: GridNodeData) => GridNodeData[]
  ): {
    visited: GridNodeData[];
    path: GridNodeData[];
    pathFromStart?: GridNodeData[];
    pathFromEnd?: GridNodeData[];
    found: boolean;
  } {
    const visitedNodes: GridNodeData[] = [];

    // Two queues: one from start, one from end
    // Create copies to maintain separate parent chains
    const startCopy = { ...start, parent: null };
    const endCopy = { ...end, parent: null };

    const queueFromStart: GridNodeData[] = [startCopy];
    const queueFromEnd: GridNodeData[] = [endCopy];

    // Track which nodes have been visited from each direction
    const visitedFromStart = new Map<string, GridNodeData>();
    const visitedFromEnd = new Map<string, GridNodeData>();

    visitedFromStart.set(`${start.row}-${start.col}`, startCopy);
    visitedFromEnd.set(`${end.row}-${end.col}`, endCopy);

    while (queueFromStart.length > 0 || queueFromEnd.length > 0) {
      // Expand from start side
      if (queueFromStart.length > 0) {
        const meetingPoint = this.expandFrontier(
          queueFromStart,
          visitedFromStart,
          visitedFromEnd,
          getAdjacentNodes,
          visitedNodes
        );

        if (meetingPoint) {
          return this.buildPath(meetingPoint, visitedFromStart, visitedFromEnd, visitedNodes);
        }
      }

      // Expand from end side
      if (queueFromEnd.length > 0) {
        const meetingPoint = this.expandFrontier(
          queueFromEnd,
          visitedFromEnd,
          visitedFromStart,
          getAdjacentNodes,
          visitedNodes
        );

        if (meetingPoint) {
          return this.buildPath(meetingPoint, visitedFromStart, visitedFromEnd, visitedNodes);
        }
      }
    }

    return { visited: visitedNodes, path: [], found: false };
  }

  private expandFrontier(
    queue: GridNodeData[],
    visitedFromThis: Map<string, GridNodeData>,
    visitedFromOther: Map<string, GridNodeData>,
    getAdjacentNodes: (node: GridNodeData) => GridNodeData[],
    visitedNodes: GridNodeData[]
  ): GridNodeData | null {
    const current = queue.shift()!;
    const adjacentNodes = getAdjacentNodes(current);

    for (const node of adjacentNodes) {
      const nodeKey = `${node.row}-${node.col}`;

      // Check if we've met the other search frontier
      if (visitedFromOther.has(nodeKey)) {
        // Meeting point found! Create a copy with this frontier's parent chain
        const meetingNode = { ...node, parent: current };
        visitedFromThis.set(nodeKey, meetingNode);
        return meetingNode;
      }

      // If not visited from this direction yet, add it
      if (!visitedFromThis.has(nodeKey)) {
        // Create a copy to avoid modifying shared grid nodes
        const nodeCopy = { ...node, parent: current };
        visitedFromThis.set(nodeKey, nodeCopy);
        queue.push(nodeCopy);
        visitedNodes.push(node);
      }
    }

    return null;
  }

  private buildPath(
    meetingPoint: GridNodeData,
    visitedFromStart: Map<string, GridNodeData>,
    visitedFromEnd: Map<string, GridNodeData>,
    visitedNodes: GridNodeData[]
  ): {
    visited: GridNodeData[];
    path: GridNodeData[];
    pathFromStart: GridNodeData[];
    pathFromEnd: GridNodeData[];
    found: boolean;
  } {
    const path: GridNodeData[] = [];
    const meetingKey = `${meetingPoint.row}-${meetingPoint.col}`;

    // Build path from start to meeting point
    const nodeFromStart = visitedFromStart.get(meetingKey);
    const pathFromStart = nodeFromStart ? PathBuilder.buildPath(nodeFromStart) : [];

    // Build path from meeting point to end (reverse direction)
    const nodeFromEnd = visitedFromEnd.get(meetingKey);
    const pathToEnd: GridNodeData[] = [];

    if (nodeFromEnd && nodeFromEnd.parent) {
      let endNode: GridNodeData | null = nodeFromEnd.parent;

      while (endNode) {
        pathToEnd.push(endNode);
        endNode = endNode.parent;
      }
    }

    // Reverse the path from end so it goes meeting -> end
    pathToEnd.reverse();

    // Combine both paths
    path.push(...pathFromStart, ...pathToEnd);

    // Balance path lengths for synchronized animation
    // Pad the shorter path with empty entries so animations stay in sync
    const maxLength = Math.max(pathFromStart.length, pathToEnd.length);

    // Create padded arrays - pad at the END so animation starts from origin
    const balancedPathFromStart = [...pathFromStart];
    const balancedPathFromEnd = [...pathToEnd];

    // Pad shorter path at the end with duplicate of last node (meeting point)
    // This makes the animation pause at meeting point while other path catches up
    while (balancedPathFromStart.length < maxLength) {
      balancedPathFromStart.push(balancedPathFromStart[balancedPathFromStart.length - 1]);
    }
    while (balancedPathFromEnd.length < maxLength) {
      balancedPathFromEnd.push(balancedPathFromEnd[balancedPathFromEnd.length - 1]);
    }
    return {
      visited: visitedNodes,
      path,
      pathFromStart: balancedPathFromStart,
      pathFromEnd: balancedPathFromEnd,
      found: true,
    };
  }
}
