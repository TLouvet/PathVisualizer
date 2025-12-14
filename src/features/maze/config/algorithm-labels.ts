import { MazeAlgorithm } from '../types/maze';

interface MazeAlgorithmOption {
  value: MazeAlgorithm;
  label: string;
  description: string;
}

const mazeAlgorithmLabels: Record<MazeAlgorithm, { label: string; description: string }> = {
  [MazeAlgorithm.DFS]: {
    label: 'DFS Maze',
    description: 'Creates long winding passages with fewer branches',
  },
  [MazeAlgorithm.PRIM]: {
    label: 'Prim Maze',
    description: 'Generates complex mazes with many branching paths',
  },
};

export const mazeAlgorithmOptions: MazeAlgorithmOption[] = Object.values(MazeAlgorithm).map((value) => ({
  value,
  label: mazeAlgorithmLabels[value].label,
  description: mazeAlgorithmLabels[value].description,
}));
