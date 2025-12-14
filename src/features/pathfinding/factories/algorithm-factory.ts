import { AlgorithmType } from '../types/algorithm';
import { DFSAlgorithm } from '../algorithms/dfs';
import { GreedyDFSAlgorithm } from '../algorithms/greedy-dfs';
import { BFSAlgorithm } from '../algorithms/bfs';
import { GreedyBestFirstAlgorithm } from '../algorithms/greedy-best-first';
import { BidirectionalSearchAlgorithm } from '../algorithms/bidirectional-search';
import { DijkstraAlgorithm } from '../algorithms/dijkstra';
import { AStarAlgorithm } from '../algorithms/astar';
import { JumpPointSearchAlgorithm } from '../algorithms/jump-point-search';

type Algorithm =
  | DFSAlgorithm
  | GreedyDFSAlgorithm
  | BFSAlgorithm
  | GreedyBestFirstAlgorithm
  | BidirectionalSearchAlgorithm
  | DijkstraAlgorithm
  | AStarAlgorithm
  | JumpPointSearchAlgorithm;

export class AlgorithmFactory {
  private static algorithms: Record<AlgorithmType, () => Algorithm> = {
    [AlgorithmType.DFS]: () => new DFSAlgorithm(),
    [AlgorithmType.GREEDY_DFS]: () => new GreedyDFSAlgorithm(),
    [AlgorithmType.BFS]: () => new BFSAlgorithm(),
    [AlgorithmType.GREEDY_BFS]: () => new GreedyBestFirstAlgorithm(),
    [AlgorithmType.BIDIRECTIONAL]: () => new BidirectionalSearchAlgorithm(),
    [AlgorithmType.DIJKSTRA]: () => new DijkstraAlgorithm(),
    [AlgorithmType.ASTAR]: () => new AStarAlgorithm(),
    [AlgorithmType.JPS]: () => new JumpPointSearchAlgorithm(),
  };

  static create(type: AlgorithmType): Algorithm {
    const algorithmFactory = this.algorithms[type];

    if (!algorithmFactory) {
      throw new Error(`Unknown algorithm type: ${type}`);
    }

    return algorithmFactory();
  }
}
