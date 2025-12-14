import { useCallback, useEffect, useRef } from 'react';
import { useGridStore } from '../../store/grid-store';
import { PathOption } from '../../types/grid-node';
import { usePathfindingCanvas } from '../../hooks/usePathfindingCanvas';
import { useMazeGeneration } from '../../features/maze/hooks/use-maze-generation';
import { useCanvasGridManager } from '../../contexts/CanvasGridContext';
import CanvasGrid from './canvas-grid-v2';

const Grid = () => {
  // Subscribe to grid metadata, NOT node data
  const currentTool = useGridStore((state) => state.currentTool);
  const isDrawing = useGridStore((state) => state.isDrawing);
  const setIsDrawing = useGridStore((state) => state.setIsDrawing);
  const gridVersion = useGridStore((state) => state.gridVersion);
  const incrementGridVersion = useGridStore((state) => state.incrementGridVersion);
  const generateMazeAnimatedTrigger = useGridStore((state) => state.generateMazeAnimatedTrigger);
  const { manager } = useCanvasGridManager();
  const { runAlgorithm } = usePathfindingCanvas();
  const { generateMazeAnimated } = useMazeGeneration();

  // Track if we modified the path during drawing session
  const modifiedPathDuringDraw = useRef(false);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!manager) return;

      // Use placeNode for start/end/none
      if (currentTool === PathOption.START || currentTool === PathOption.END || currentTool === PathOption.NONE) {
        manager.placeNode(row, col, currentTool);
        // Run algorithm if both start and end are placed
        if (manager.startNode && manager.endNode) {
          runAlgorithm();
        }
      } else {
        // For walls and other states
        const node = manager.getNode(row, col);
        const wasPartOfPath = node?.state === PathOption.SOLUTION || node?.state === PathOption.VISITED;

        manager.updateNodeState(row, col, currentTool);

        // Track if we modified the path - recalculation happens on mouse up if drawing
        if (currentTool === PathOption.WALL && wasPartOfPath && manager.startNode && manager.endNode) {
          if (isDrawing) {
            modifiedPathDuringDraw.current = true;
          } else {
            // Single click - trigger immediately
            incrementGridVersion();
          }
        }
      }
    },
    [manager, currentTool, runAlgorithm, incrementGridVersion, isDrawing]
  );

  // Run algorithm when grid structure changes (walls, start, end)
  useEffect(() => {
    if (manager && manager.startNode && manager.endNode) {
      runAlgorithm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridVersion]);

  // Run animated maze generation when triggered
  useEffect(() => {
    if (generateMazeAnimatedTrigger > 0) {
      generateMazeAnimated();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateMazeAnimatedTrigger]);

  // En gros cette fonction c'est pour faire du dessin de mur ou les effacer
  const handleCellMouseEnter = useCallback(
    (row: number, col: number) => {
      if (!isDrawing) return;

      if (currentTool !== PathOption.WALL && currentTool !== PathOption.NONE) return;

      if (!manager) return;

      // Get node to check state
      const node = manager.getNode(row, col);
      // Don't overwrite start/end nodes when dragging
      if (node?.state === PathOption.START || node?.state === PathOption.END) return;

      const wasPartOfPath = node?.state === PathOption.SOLUTION || node?.state === PathOption.VISITED;

      manager.updateNodeState(row, col, currentTool);

      // Track if we modified the path during this drawing session
      if (currentTool === PathOption.WALL && wasPartOfPath && manager.startNode && manager.endNode) {
        modifiedPathDuringDraw.current = true;
      }
    },
    [manager, isDrawing, currentTool]
  );

  const handleCellMouseDown = useCallback(() => {
    setIsDrawing(true);
  }, [setIsDrawing]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);

    // Trigger recalculation if we modified the path during drawing
    if (modifiedPathDuringDraw.current) {
      incrementGridVersion();
      modifiedPathDuringDraw.current = false;
    }
  }, [setIsDrawing, incrementGridVersion]);

  const handleMouseLeave = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);

      // Trigger recalculation if we modified the path during drawing
      if (modifiedPathDuringDraw.current) {
        incrementGridVersion();
        modifiedPathDuringDraw.current = false;
      }
    }
  }, [isDrawing, setIsDrawing, incrementGridVersion]);

  return (
    <div
      className="relative p-4 bg-white/8 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)] before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_40%,rgba(102,126,234,0.4)_0%,transparent_50%),radial-gradient(circle_at_70%_60%,rgba(236,72,153,0.3)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.2)_0%,transparent_50%)] before:blur-[60px] before:-z-10 before:animate-[floatBackground_20s_ease-in-out_infinite] overflow-hidden h-full"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <CanvasGrid
        onCellClick={handleCellClick}
        onCellMouseEnter={handleCellMouseEnter}
        onCellMouseDown={handleCellMouseDown}
      />
    </div>
  );
};

export default Grid;
