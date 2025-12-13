import { AlgorithmType, DirectionType } from '@/types/algorithm';
import { MazeAlgorithm } from '@/features/maze/types/maze';

const algorithmLabels: Record<AlgorithmType, string> = {
  [AlgorithmType.DFS]: 'DFS',
  [AlgorithmType.GREEDY_DFS]: 'Greedy DFS',
  [AlgorithmType.BFS]: 'BFS',
  [AlgorithmType.GREEDY_BFS]: 'Greedy Best-First',
  [AlgorithmType.BIDIRECTIONAL]: 'Bidirectional BFS',
  [AlgorithmType.DIJKSTRA]: 'Dijkstra',
  [AlgorithmType.ASTAR]: 'A*',
  [AlgorithmType.JPS]: 'Jump Point Search',
};

const mazeAlgorithmLabels: Record<MazeAlgorithm, string> = {
  [MazeAlgorithm.DFS]: 'DFS Maze',
  [MazeAlgorithm.PRIM]: 'Prim Maze',
};

const directionLabels: Record<DirectionType, string> = {
  [DirectionType.FOUR]: '4-Way',
  [DirectionType.EIGHT]: '8-Way',
};

export const algorithmOptions = Object.values(AlgorithmType).map((value) => ({
  value,
  label: algorithmLabels[value],
}));

export const mazeAlgorithmOptions = Object.values(MazeAlgorithm).map((value) => ({
  value,
  label: mazeAlgorithmLabels[value],
}));

export const directionOptions = [DirectionType.FOUR, DirectionType.EIGHT].map((value) => ({
  value: String(value),
  label: directionLabels[value],
}));
