import { CreateSearchStrategyFactory } from './SearchStrategies/CreateSearchStrategyFactory.js';
export class Solver {
    searchStrategyFactory;
    strategy;
    constructor(nodes) {
        this.searchStrategyFactory = new CreateSearchStrategyFactory();
        this.strategy = this.searchStrategyFactory.getStrategy(nodes);
    }
    solve(start, end) {
        this.strategy.solve(start, end);
    }
    changeStrategy(nodes) {
        this.strategy = this.searchStrategyFactory.getStrategy(nodes);
    }
    changeSearchComponent() {
        this.strategy.changeSearchComponent();
    }
    clear() {
        this.strategy.clear();
    }
}
