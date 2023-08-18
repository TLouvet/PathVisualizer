import { SearchStrategy } from './SearchStrategies/interface/SearchStrategy.interface';

export class Solver {
  constructor(private strategy: SearchStrategy) {}

  solve() {
    this.strategy.solve();
  }

  changeStrategy(strategy: SearchStrategy) {
    this.strategy = strategy;
  }

  changeSearchComponent(componentType: '4D' | '8D') {
    this.strategy.changeSearchComponent(componentType);
  }

  clear() {
    this.strategy.clear();
  }
}
