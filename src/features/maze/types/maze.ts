export const MazeAlgorithm = {
  DFS: 'DFS',
  PRIM: 'Prim',
  CELLULAR_AUTOMATA: 'Cellular Automata',
} as const;

export type MazeAlgorithm = typeof MazeAlgorithm[keyof typeof MazeAlgorithm];
