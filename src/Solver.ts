import { SearchStrategy } from './SearchStrategies/interface/SearchStrategy.interface';

export class Solver {
  constructor(private strategy: SearchStrategy) {}

  solve() {
    this.strategy.solve();
  }

  changeStrategy(strategy: SearchStrategy) {
    this.strategy = strategy;
  }

  changeSearchComponent() {
    this.strategy.changeSearchComponent();
  }

  clear() {
    this.strategy.clear();
  }
}
