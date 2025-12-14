import type { GridNodeData } from '@/types/grid-node';

export const AlgorithmType = {
  DFS: 'dfs',
  GREEDY_DFS: 'greedy-dfs',
  BFS: 'bfs',
  GREEDY_BFS: 'greedy-bfs',
  BIDIRECTIONAL: 'bidirectional',
  DIJKSTRA: 'dijkstra',
  ASTAR: 'astar',
  JPS: 'jps',
} as const;

export type AlgorithmType = (typeof AlgorithmType)[keyof typeof AlgorithmType];

export const DirectionType = {
  FOUR: 4,
  EIGHT: 8,
} as const;

export type DirectionType = (typeof DirectionType)[keyof typeof DirectionType];

export interface AlgorithmResult {
  path: GridNodeData[];
  visited: GridNodeData[];
  executionTime: number;
}

export interface SearchStrategy {
  search(
    grid: GridNodeData[][],
    start: GridNodeData,
    end: GridNodeData,
    onVisit?: (node: GridNodeData) => void
  ): AlgorithmResult;
}
