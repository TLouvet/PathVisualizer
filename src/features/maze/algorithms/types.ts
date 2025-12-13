import { type GridNodeData } from '@/types/grid-node';

export interface MazeStep {
  cellsToCarve: Array<{ row: number; col: number }>;
}

export interface MazeGeneratorParams {
  width: number;
  height: number;
  startNode: GridNodeData | null;
  endNode: GridNodeData | null;
  offset: { row: number; col: number };
}

/**
 * Strategy interface for maze generation algorithms.
 *
 * We use a Generator here because we want to visualize the maze being carved step-by-step.
 * The generator yields after each carving operation, giving us control to throttle the animation,
 * abort mid-execution, and keep the UI responsive without blocking the main thread.
 */
export interface MazeGeneratorStrategy {
  execute(params: MazeGeneratorParams): Generator<MazeStep, void, unknown>;
}
