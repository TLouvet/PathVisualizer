import { useCallback, useEffect, useRef } from 'react';
import { useGridStore } from '@/store/grid-store';
import { PathOption } from '@/types/grid-node';
import { MazeAlgorithm } from '../types/maze';
import { DFSMazeStrategy } from '../algorithms/dfs-maze.strategy';
import { PrimMazeStrategy } from '../algorithms/prim-maze.strategy';
import { useCanvasGridManager } from '@/contexts/CanvasGridContext';

export function useMazeGeneration() {
  const { manager } = useCanvasGridManager();
  const { gridWidth, gridHeight, selectedMazeAlgorithm, gridVersion, setIsCalculating, incrementGridVersion } =
    useGridStore();

  // AbortController to cancel ongoing animations
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateMazeAnimated = useCallback(async () => {
    if (!manager) {
      console.log('Grid manager not initialized');
      return;
    }

    // Cancel any ongoing animation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this run
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsCalculating(true);

    const startNode = manager.startNode;
    const endNode = manager.endNode;

    // Store start/end positions
    const startPos = startNode ? { row: startNode.row, col: startNode.col } : null;
    const endPos = endNode ? { row: endNode.row, col: endNode.col } : null;

    // Fill entire grid with walls
    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        // Skip start and end positions
        if (
          (startPos && row === startPos.row && col === startPos.col) ||
          (endPos && row === endPos.row && col === endPos.col)
        ) {
          continue;
        }
        manager.updateNodeState(row, col, PathOption.WALL);
      }
    }

    // Give time to render the walls before starting animation
    await new Promise((resolve) => setTimeout(resolve, 50));

    if (signal.aborted) {
      setIsCalculating(false);
      return;
    }

    // Select the appropriate maze generator strategy
    const strategy = selectedMazeAlgorithm === MazeAlgorithm.PRIM ? new PrimMazeStrategy() : new DFSMazeStrategy();

    // Generate maze for the entire grid (no forced border walls)
    const generator = strategy.execute({
      width: gridWidth,
      height: gridHeight,
      startNode,
      endNode,
      offset: { row: 0, col: 0 },
    });

    const totalNodes = gridWidth * gridHeight;
    const THROTTLE_INTERVAL = totalNodes > 800 ? 30 : 20;
    let stepCount = 0;

    // Animate the maze generation
    for (const step of generator) {
      if (signal.aborted) {
        setIsCalculating(false);
        return;
      }

      // Carve out cells
      step.cellsToCarve.forEach(({ row, col }) => {
        // Don't overwrite start/end nodes
        if (
          (startPos && row === startPos.row && col === startPos.col) ||
          (endPos && row === endPos.row && col === endPos.col)
        ) {
          return;
        }

        manager.updateNodeState(row, col, PathOption.NONE);
      });

      // Throttle animation for visual effect
      stepCount++;
      if (stepCount % THROTTLE_INTERVAL === 0) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
    }

    setIsCalculating(false);

    // Trigger pathfinding if start and end nodes exist
    if (startNode && endNode) {
      incrementGridVersion();
    }
  }, [manager, gridWidth, gridHeight, selectedMazeAlgorithm, setIsCalculating, incrementGridVersion]);

  // Abort ongoing animation when grid structure changes (size, reset)
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, [gridVersion]);

  // Cancel animation when component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { generateMazeAnimated };
}
