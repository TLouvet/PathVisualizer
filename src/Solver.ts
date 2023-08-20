import { GraphNode } from './GraphNode/GraphNode';
import { CreateSearchStrategyFactory } from './SearchStrategies/CreateSearchStrategyFactory';
import { SearchStrategy } from './SearchStrategies/interface/SearchStrategy.interface';

export class Solver {
  // private searchStrategyFactory: CreateSearchStrategyFactory;
  // private strategy: SearchStrategy;

  constructor(nodes: GraphNode[]) {
    // this.searchStrategyFactory = new CreateSearchStrategyFactory();
    // this.strategy = this.searchStrategyFactory.getStrategy(nodes);
  }

  // solve(start: GraphNode | null, end: GraphNode | null) {
  //   this.strategy.solve(start, end);
  // }

  // changeStrategy(nodes: GraphNode[]) {
  //   this.strategy = this.searchStrategyFactory.getStrategy(nodes);
  // }

  // changeSearchComponent(nodes: GraphNode[]) {
  //   this.strategy.changeSearchComponent(nodes);
  // }

  // clear() {
  //   this.strategy.clear();
  // }

  executeStrategy(strategy: SearchStrategy, start: GraphNode | null, end: GraphNode | null) {
    return strategy.solve(start, end);
  }
}
