export const PathOption = {
  START: 'Start',
  END: 'End',
  WALL: 'Wall',
  NONE: 'None',
  VISITED: 'Visited',
  SOLUTION: 'Solution',
} as const;

export type PathOption = typeof PathOption[keyof typeof PathOption];

export interface GridNodeData {
  row: number;
  col: number;
  state: PathOption;
  parent: GridNodeData | null;
  // For algorithm calculations
  costFromStart: number; // g in A*
  heuristicToEnd: number; // h in A*
  totalCost: number; // f in A* (costFromStart + heuristicToEnd)
}

export interface Point2D {
  x: number;
  y: number;
}
