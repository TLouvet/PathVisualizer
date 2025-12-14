import { MazeAlgorithm } from '../types/maze';

const mazeAlgorithmLabels: Record<MazeAlgorithm, string> = {
  [MazeAlgorithm.DFS]: 'DFS Maze',
  [MazeAlgorithm.PRIM]: 'Prim Maze',
};

export const mazeAlgorithmOptions = Object.values(MazeAlgorithm).map((value) => ({
  value,
  label: mazeAlgorithmLabels[value],
}));
