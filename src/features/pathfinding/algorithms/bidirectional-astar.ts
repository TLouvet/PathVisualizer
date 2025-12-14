import type { GridNodeData } from '@/types/grid-node';
import { PathBuilder } from './path-builder';

interface AStarNode extends GridNodeData {
  g: number; // Cost from start
  h: number; // Heuristic to goal
  f: number; // g + h
}

export class BidirectionalAStarAlgorithm {
  solve(
    start: GridNodeData,
    end: GridNodeData,
    getAdjacentNodes: (node: GridNodeData) => GridNodeData[],
    heuristic: (a: GridNodeData, b: GridNodeData) => number
  ): {
    visited: GridNodeData[];
    path: GridNodeData[];
    pathFromStart?: GridNodeData[];
    pathFromEnd?: GridNodeData[];
    found: boolean;
  } {
    const visitedNodes: GridNodeData[] = [];

    // Create A* nodes for start and end
    const startNode: AStarNode = { ...start, parent: null, g: 0, h: 0, f: 0 };
    const endNode: AStarNode = { ...end, parent: null, g: 0, h: 0, f: 0 };

    // Open lists (priority queues) for both directions
    const openFromStart: AStarNode[] = [startNode];
    const openFromEnd: AStarNode[] = [endNode];

    // Closed sets (visited nodes) for both directions
    const closedFromStart = new Map<string, AStarNode>();
    const closedFromEnd = new Map<string, AStarNode>();

    // Track best known g-scores
    const gScoresFromStart = new Map<string, number>();
    const gScoresFromEnd = new Map<string, number>();

    gScoresFromStart.set(`${start.row}-${start.col}`, 0);
    gScoresFromEnd.set(`${end.row}-${end.col}`, 0);

    // Best path length found so far
    let bestPathLength = Infinity;
    let bestMeetingPoint: { nodeFromStart: AStarNode; nodeFromEnd: AStarNode } | null = null;

    while (openFromStart.length > 0 || openFromEnd.length > 0) {
      // Expand from start side
      if (openFromStart.length > 0) {
        const result = this.expandFrontier(
          openFromStart,
          closedFromStart,
          closedFromEnd,
          gScoresFromStart,
          gScoresFromEnd,
          getAdjacentNodes,
          heuristic,
          end,
          visitedNodes,
          bestPathLength
        );

        if (result.meetingPoint) {
          const pathLength = result.meetingPoint.nodeFromStart.g + result.meetingPoint.nodeFromEnd.g;
          if (pathLength < bestPathLength) {
            bestPathLength = pathLength;
            bestMeetingPoint = result.meetingPoint;
          }
        }
      }

      // Expand from end side
      if (openFromEnd.length > 0) {
        const result = this.expandFrontier(
          openFromEnd,
          closedFromEnd,
          closedFromStart,
          gScoresFromEnd,
          gScoresFromStart,
          getAdjacentNodes,
          heuristic,
          start,
          visitedNodes,
          bestPathLength
        );

        if (result.meetingPoint) {
          const pathLength = result.meetingPoint.nodeFromStart.g + result.meetingPoint.nodeFromEnd.g;
          if (pathLength < bestPathLength) {
            bestPathLength = pathLength;
            // Swap because we're coming from opposite direction
            bestMeetingPoint = {
              nodeFromStart: result.meetingPoint.nodeFromEnd,
              nodeFromEnd: result.meetingPoint.nodeFromStart,
            };
          }
        }
      }

      // Early termination: if both open lists have minimum f-score >= best path length, we're done
      if (bestMeetingPoint) {
        const minFStart = openFromStart.length > 0 ? Math.min(...openFromStart.map((n) => n.f)) : Infinity;
        const minFEnd = openFromEnd.length > 0 ? Math.min(...openFromEnd.map((n) => n.f)) : Infinity;

        if (minFStart + minFEnd >= bestPathLength) {
          return this.buildPath(bestMeetingPoint, visitedNodes);
        }
      }
    }

    if (bestMeetingPoint) {
      return this.buildPath(bestMeetingPoint, visitedNodes);
    }

    return { visited: visitedNodes, path: [], found: false };
  }

  private expandFrontier(
    openList: AStarNode[],
    closedFromThis: Map<string, AStarNode>,
    closedFromOther: Map<string, AStarNode>,
    gScoresFromThis: Map<string, number>,
    gScoresFromOther: Map<string, number>,
    getAdjacentNodes: (node: GridNodeData) => GridNodeData[],
    heuristic: (a: GridNodeData, b: GridNodeData) => number,
    goal: GridNodeData,
    visitedNodes: GridNodeData[],
    bestPathLength: number
  ): {
    meetingPoint: { nodeFromStart: AStarNode; nodeFromEnd: AStarNode } | null;
  } {
    // Sort by f-score (A* priority)
    openList.sort((a, b) => a.f - b.f);
    const current = openList.shift()!;

    const currentKey = `${current.row}-${current.col}`;
    closedFromThis.set(currentKey, current);

    // Check if other search has visited this node
    const otherNode = closedFromOther.get(currentKey);
    if (otherNode) {
      const pathLength = current.g + otherNode.g;
      if (pathLength < bestPathLength) {
        return {
          meetingPoint: {
            nodeFromStart: current,
            nodeFromEnd: otherNode,
          },
        };
      }
    }

    const adjacentNodes = getAdjacentNodes(current);

    for (const node of adjacentNodes) {
      const nodeKey = `${node.row}-${node.col}`;

      // Skip if already in closed set
      if (closedFromThis.has(nodeKey)) {
        continue;
      }

      // Calculate tentative g score (cost from start)
      const tentativeG = current.g + 1; // Assuming uniform cost of 1

      const currentBestG = gScoresFromThis.get(nodeKey);

      // Skip if we've found a better path to this node already
      if (currentBestG !== undefined && tentativeG >= currentBestG) {
        continue;
      }

      // This is a better path
      gScoresFromThis.set(nodeKey, tentativeG);

      const h = heuristic(node, goal);
      const f = tentativeG + h;

      const astarNode: AStarNode = {
        ...node,
        parent: current,
        g: tentativeG,
        h,
        f,
      };

      // Check if meeting with other frontier
      const otherNodeAtKey = closedFromOther.get(nodeKey);
      if (otherNodeAtKey) {
        const pathLength = astarNode.g + otherNodeAtKey.g;
        if (pathLength < bestPathLength) {
          return {
            meetingPoint: {
              nodeFromStart: astarNode,
              nodeFromEnd: otherNodeAtKey,
            },
          };
        }
      }

      // Remove old node with worse g-score if it exists
      const existingIndex = openList.findIndex((n) => n.row === node.row && n.col === node.col);
      if (existingIndex !== -1) {
        openList.splice(existingIndex, 1);
      }

      openList.push(astarNode);
      visitedNodes.push(node);
    }

    return { meetingPoint: null };
  }

  private buildPath(
    meetingPoint: { nodeFromStart: AStarNode; nodeFromEnd: AStarNode },
    visitedNodes: GridNodeData[]
  ): {
    visited: GridNodeData[];
    path: GridNodeData[];
    pathFromStart: GridNodeData[];
    pathFromEnd: GridNodeData[];
    found: boolean;
  } {
    // Build path from start to meeting point
    const pathFromStart = PathBuilder.buildPath(meetingPoint.nodeFromStart);

    // Build path from meeting point to end
    const pathToEnd: GridNodeData[] = [];
    if (meetingPoint.nodeFromEnd.parent) {
      let current: GridNodeData | null = meetingPoint.nodeFromEnd.parent;
      while (current) {
        pathToEnd.push(current);
        current = current.parent;
      }
    }

    // Reverse the path from end so it goes meeting -> end
    pathToEnd.reverse();

    // Combine both paths
    const path = [...pathFromStart, ...pathToEnd];

    // Balance path lengths for synchronized animation
    const maxLength = Math.max(pathFromStart.length, pathToEnd.length);

    const balancedPathFromStart = [...pathFromStart];
    const balancedPathFromEnd = [...pathToEnd];

    // Pad shorter path at the end with duplicate of last node
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
