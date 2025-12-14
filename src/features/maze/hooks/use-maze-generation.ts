import { useCallback } from 'react';
import { useGridStore } from '@/store/grid-store';
import { PathOption } from '@/types/grid-node';
import { MazeAlgorithm } from '../types/maze';
import { DFSMazeStrategy } from '../algorithms/dfs-maze.strategy';
import { PrimMazeStrategy } from '../algorithms/prim-maze.strategy';
import { CellularAutomataMazeStrategy } from '../algorithms/cellular-automata-maze.strategy';
import { useCanvasGridManager } from '@/contexts/CanvasGridContext';
import { useAbortController } from '@/shared/hooks/use-abort-controller';

export function useMazeGeneration() {
  const { manager } = useCanvasGridManager();
  const { gridWidth, gridHeight, selectedMazeAlgorithm, gridVersion, setIsCalculating, incrementGridVersion } =
    useGridStore();

  // AbortController to cancel ongoing animations
  const { createController } = useAbortController([gridVersion]);

  const generateMazeAnimated = useCallback(async () => {
    if (!manager) {
      return;
    }

    const controller = createController();
    const signal = controller.signal;

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
    let strategy;
    if (selectedMazeAlgorithm === MazeAlgorithm.PRIM) {
      strategy = new PrimMazeStrategy();
    } else if (selectedMazeAlgorithm === MazeAlgorithm.CELLULAR_AUTOMATA) {
      strategy = new CellularAutomataMazeStrategy();
    } else {
      strategy = new DFSMazeStrategy();
    }

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
  }, [manager, gridWidth, gridHeight, selectedMazeAlgorithm, setIsCalculating, incrementGridVersion, createController]);

  return { generateMazeAnimated };
}
