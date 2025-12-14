import { useCallback, useEffect } from 'react';
import { useGridStore } from '../store/grid-store';
import { AlgorithmType, DirectionType } from '../features/pathfinding/types/algorithm';
import { type GridNodeData, PathOption } from '../types/grid-node';
import { DFSAlgorithm } from '../features/pathfinding/algorithms/dfs';
import { GreedyDFSAlgorithm } from '../features/pathfinding/algorithms/greedy-dfs';
import { BFSAlgorithm } from '../features/pathfinding/algorithms/bfs';
import { GreedyBestFirstAlgorithm } from '../features/pathfinding/algorithms/greedy-best-first';
import { BidirectionalSearchAlgorithm } from '../features/pathfinding/algorithms/bidirectional-search';
import { DijkstraAlgorithm } from '../features/pathfinding/algorithms/dijkstra';
import { AStarAlgorithm } from '../features/pathfinding/algorithms/astar';
import { JumpPointSearchAlgorithm } from '../features/pathfinding/algorithms/jump-point-search';
import { getAdjacentNodes4Direction, getAdjacentNodes8Direction } from '../features/pathfinding/algorithms/helpers';
import type { CanvasGridManager } from '../core/canvas/CanvasGridManager';
import { useCanvasGridManager } from '../contexts/CanvasGridContext';
import { ManhattanDistance } from '../core/distance/manhattan-distance';
import { EuclidianDistance } from '../core/distance/euclidian-distance';
import { useAbortController } from '../shared/hooks/use-abort-controller';

export function usePathfindingCanvas() {
  const { selectedAlgorithm, selectedDirection, gridVersion, showVisitedNodes, setIsCalculating, setExecutionTime } =
    useGridStore();
  const { manager } = useCanvasGridManager();

  // AbortController to cancel ongoing animations
  const { createController } = useAbortController([gridVersion]);

  const visualizePath = useCallback(
    async (
      visited: GridNodeData[],
      path: GridNodeData[],
      signal: AbortSignal,
      gridSize: number,
      manager: CanvasGridManager,
      shouldShowVisited: boolean,
      pathFromStart?: GridNodeData[],
      pathFromEnd?: GridNodeData[]
    ) => {
      const THROTTLE_INTERVAL = 10 + Math.floor(gridSize / 100); // Update animation every N nodes

      // Animate visited nodes only if enabled
      if (shouldShowVisited) {
        for (let i = 0; i < visited.length; i++) {
          if (signal.aborted) return;

          const node = visited[i];
          if (node.state !== PathOption.START && node.state !== PathOption.END) {
            manager.updateNodeState(node.row, node.col, PathOption.VISITED);

            // Throttle animation for visual effect
            if (i % THROTTLE_INTERVAL === 0) {
              await new Promise((resolve) => requestAnimationFrame(resolve));
            }
          }
        }
      }

      // Animate solution path - check if bidirectional
      if (pathFromStart && pathFromEnd) {
        // Bidirectional: render both paths simultaneously
        const maxLength = Math.max(pathFromStart.length, pathFromEnd.length);

        for (let i = 0; i < maxLength; i++) {
          if (signal.aborted) return;

          // Update node from start path
          if (i < pathFromStart.length) {
            const node = pathFromStart[i];
            if (node.state !== PathOption.START && node.state !== PathOption.END) {
              manager.updateNodeState(node.row, node.col, PathOption.SOLUTION);
            }
          }

          // Update node from end path
          if (i < pathFromEnd.length) {
            const node = pathFromEnd[i];
            if (node.state !== PathOption.START && node.state !== PathOption.END) {
              manager.updateNodeState(node.row, node.col, PathOption.SOLUTION);
            }
          }

          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      } else {
        // Regular path rendering
        for (let i = 0; i < path.length; i++) {
          if (signal.aborted) return;

          const node = path[i];
          if (node.state !== PathOption.START && node.state !== PathOption.END) {
            manager.updateNodeState(node.row, node.col, PathOption.SOLUTION);
            await new Promise((resolve) => setTimeout(resolve, 10));
          }
        }
      }
    },
    [showVisitedNodes]
  );

  const runAlgorithm = useCallback(async () => {
    if (!manager) {
      console.log('Grid manager not initialized');
      return;
    }

    const startNode = manager.startNode;
    const endNode = manager.endNode;

    if (!startNode || !endNode) {
      console.log('Please place both start and end nodes');
      return;
    }

    // Create new AbortController for this run (auto-aborts previous)
    const controller = createController();
    const signal = controller.signal;

    setIsCalculating(true);
    manager.clearPathVisualization();

    const startTime = performance.now();

    // Get current grid state and create a deep copy for the algorithm
    const grid = manager.getGridCopy();
    const gridSize = grid.length * (grid[0]?.length || 0);

    const start = grid[startNode.row][startNode.col];
    const end = grid[endNode.row][endNode.col];

    // Select adjacent nodes function based on direction
    const getAdjacentNodes =
      selectedDirection === DirectionType.FOUR
        ? (node: GridNodeData) => getAdjacentNodes4Direction(grid, node)
        : (node: GridNodeData) => getAdjacentNodes8Direction(grid, node);

    // Select distance strategy
    const distanceStrategy =
      selectedDirection === DirectionType.FOUR ? new ManhattanDistance() : new EuclidianDistance();

    let result: {
      visited: GridNodeData[];
      path: GridNodeData[];
      found: boolean;
      pathFromStart?: GridNodeData[];
      pathFromEnd?: GridNodeData[];
    };

    // Run selected algorithm
    switch (selectedAlgorithm) {
      case AlgorithmType.DFS: {
        const dfs = new DFSAlgorithm();
        result = dfs.solve(start, end, getAdjacentNodes);
        break;
      }

      case AlgorithmType.GREEDY_DFS: {
        const greedyDfs = new GreedyDFSAlgorithm();
        result = greedyDfs.solve(start, end, getAdjacentNodes, distanceStrategy);
        break;
      }

      case AlgorithmType.BFS: {
        const bfs = new BFSAlgorithm();
        result = bfs.solve(start, end, getAdjacentNodes);
        break;
      }

      case AlgorithmType.GREEDY_BFS: {
        const greedyBfs = new GreedyBestFirstAlgorithm();
        result = greedyBfs.solve(start, end, getAdjacentNodes, distanceStrategy);
        break;
      }

      case AlgorithmType.BIDIRECTIONAL: {
        const bidirectional = new BidirectionalSearchAlgorithm();
        result = bidirectional.solve(start, end, getAdjacentNodes);
        break;
      }

      case AlgorithmType.DIJKSTRA: {
        const dijkstra = new DijkstraAlgorithm();
        result = dijkstra.solve(start, end, getAdjacentNodes, distanceStrategy);
        break;
      }

      case AlgorithmType.ASTAR: {
        const astar = new AStarAlgorithm();
        result = astar.solve(start, end, getAdjacentNodes, distanceStrategy);
        break;
      }

      case AlgorithmType.JPS: {
        const jps = new JumpPointSearchAlgorithm();
        result = jps.solve(grid, start, end, distanceStrategy);
        break;
      }

      default:
        result = { visited: [], path: [], found: false };
    }

    const endTime = performance.now();
    setExecutionTime(endTime - startTime);

    // Visualize the result
    await visualizePath(
      result.visited,
      result.path,
      signal,
      gridSize,
      manager,
      showVisitedNodes,
      result.pathFromStart,
      result.pathFromEnd
    );

    if (!result.found) {
      console.log('No path found');
    }

    setIsCalculating(false);
  }, [
    manager,
    selectedAlgorithm,
    selectedDirection,
    visualizePath,
    setIsCalculating,
    setExecutionTime,
    createController,
  ]);

  // Auto-run when algorithm or direction changes
  useEffect(() => {
    if (manager && manager.startNode && manager.endNode) {
      runAlgorithm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAlgorithm, selectedDirection]);

  return { runAlgorithm };
}
