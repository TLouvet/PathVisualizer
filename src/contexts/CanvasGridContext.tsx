import { createContext, useContext, useEffect, useRef, useMemo, useState, type ReactNode, type RefObject } from 'react';
import type { CanvasGridManager } from '../core/canvas/CanvasGridManager';
import { CanvasGridManager as CanvasGridManagerClass } from '../core/canvas/CanvasGridManager';
import { useGridStore } from '../store/grid-store';

interface CanvasGridContextType {
  manager: CanvasGridManager | null;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
}

const CanvasGridContext = createContext<CanvasGridContextType | undefined>(undefined);

export const useCanvasGridManager = () => {
  const context = useContext(CanvasGridContext);
  if (context === undefined) {
    throw new Error('useCanvasGridManager must be used within a CanvasGridProvider');
  }
  return context;
};

interface CanvasGridProviderProps {
  children: ReactNode;
}

export const CanvasGridProvider = ({ children }: CanvasGridProviderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [manager, setManager] = useState<CanvasGridManager | null>(null);
  const hasInitializedMaze = useRef(false);
  const managerRef = useRef<CanvasGridManager | null>(null);

  const gridWidth = useGridStore((state) => state.gridWidth);
  const gridHeight = useGridStore((state) => state.gridHeight);
  const showCellBorders = useGridStore((state) => state.showCellBorders);
  const triggerAnimatedMaze = useGridStore((state) => state.triggerAnimatedMaze);

  // Initialize canvas grid manager
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Only create manager if we don't have one already
    if (managerRef.current) return;

    const newManager = new CanvasGridManagerClass(canvas, gridWidth, gridHeight);
    managerRef.current = newManager;
    setManager(newManager);

    return () => {
      if (managerRef.current) {
        managerRef.current.destroy();
        managerRef.current = null;
      }
      setManager(null);
    };
  }, [gridWidth, gridHeight]);

  // Update showBorders setting when it changes
  useEffect(() => {
    if (manager) {
      manager.setShowBorders(showCellBorders);
    }
  }, [manager, showCellBorders]);

  // Generate initial DFS maze on first load
  useEffect(() => {
    if (manager && !hasInitializedMaze.current) {
      hasInitializedMaze.current = true;
      // Small delay to ensure grid is fully initialized
      setTimeout(() => {
        triggerAnimatedMaze();
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager]);

  // Create context value
  const contextValue = useMemo(
    () => ({
      manager,
      canvasRef,
      containerRef,
    }),
    [manager]
  );

  return <CanvasGridContext.Provider value={contextValue}>{children}</CanvasGridContext.Provider>;
};
