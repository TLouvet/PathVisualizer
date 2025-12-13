export const MazeAlgorithm = {
  DFS: 'DFS',
  PRIM: 'Prim',
} as const;

export type MazeAlgorithm = typeof MazeAlgorithm[keyof typeof MazeAlgorithm];
