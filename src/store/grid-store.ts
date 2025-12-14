import { create } from 'zustand';
import { type GridNodeData, PathOption } from '../types/grid-node';
import { AlgorithmType, DirectionType } from '../features/pathfinding/types/algorithm';
import { MazeAlgorithm } from '../features/maze/types/maze';
import { AnimationSpeed } from '../types/animation-speed';

// Determine initial grid size based on device
const getInitialGridSize = () => {
  if (typeof window === 'undefined') return { width: 35, height: 21 };

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile) {
    // Smaller grid for mobile devices
    return { width: 25, height: 15 };
  }

  // Default size for desktop
  return { width: 35, height: 21 };
};

const initialSize = getInitialGridSize();

interface GridStore {
  // Grid state - now using a Map for individual subscriptions
  nodes: Record<string, GridNodeData>;
  gridWidth: number;
  gridHeight: number;

  // Node references
  startNode: GridNodeData | null;
  endNode: GridNodeData | null;

  // Algorithm settings
  selectedAlgorithm: AlgorithmType;
  selectedDirection: DirectionType;
  selectedMazeAlgorithm: MazeAlgorithm;

  // Interaction state
  currentTool: PathOption;
  isDrawing: boolean;
  showVisitedNodes: boolean;
  showCellBorders: boolean;

  // Algorithm execution
  isCalculating: boolean;
  executionTime: number;

  // Animation settings
  animationSpeed: AnimationSpeed;

  // Grid change tracking (increments when walls/start/end change, not for visited/solution)
  gridVersion: number;

  // Actions
  setGridSize: (width: number, height: number) => void;
  setSelectedAlgorithm: (algorithm: AlgorithmType) => void;
  setSelectedDirection: (direction: DirectionType) => void;
  setSelectedMazeAlgorithm: (algorithm: MazeAlgorithm) => void;
  setCurrentTool: (tool: PathOption) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  setShowVisitedNodes: (show: boolean) => void;
  setShowCellBorders: (show: boolean) => void;
  setIsCalculating: (isCalculating: boolean) => void;
  setExecutionTime: (time: number) => void;
  setAnimationSpeed: (speed: AnimationSpeed) => void;
  generateMazeAnimatedTrigger: number; // Trigger counter for animated maze generation
  triggerAnimatedMaze: () => void;
  incrementGridVersion: () => void;
}

export const useGridStore = create<GridStore>((set) => ({
  // Initial state
  nodes: {},
  gridWidth: initialSize.width,
  gridHeight: initialSize.height,
  startNode: null,
  endNode: null,
  selectedAlgorithm: AlgorithmType.DFS,
  selectedDirection: DirectionType.FOUR,
  selectedMazeAlgorithm: MazeAlgorithm.DFS,
  currentTool: PathOption.NONE,
  isDrawing: false,
  showVisitedNodes: true,
  showCellBorders: true,
  isCalculating: false,
  executionTime: 0,
  animationSpeed: AnimationSpeed.MEDIUM,
  gridVersion: 0,
  generateMazeAnimatedTrigger: 0,

  setGridSize: (width, height) =>
    set((store) => ({
      gridWidth: width,
      gridHeight: height,
      nodes: {},
      startNode: null,
      endNode: null,
      gridVersion: store.gridVersion + 1,
    })),

  setSelectedAlgorithm: (algorithm) => set({ selectedAlgorithm: algorithm }),
  setSelectedDirection: (direction) => set({ selectedDirection: direction }),
  setSelectedMazeAlgorithm: (algorithm) => set({ selectedMazeAlgorithm: algorithm }),
  setCurrentTool: (tool) => set({ currentTool: tool }),
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  setShowVisitedNodes: (show) => set({ showVisitedNodes: show }),
  setShowCellBorders: (show) => set({ showCellBorders: show }),
  setIsCalculating: (isCalculating) => set({ isCalculating }),
  setExecutionTime: (time) => set({ executionTime: time }),
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),

  triggerAnimatedMaze: () =>
    set((store) => ({
      generateMazeAnimatedTrigger: store.generateMazeAnimatedTrigger + 1,
    })),

  // Helper to increment gridVersion after maze generation
  incrementGridVersion: () =>
    set((store) => ({
      gridVersion: store.gridVersion + 1,
    })),
}));
