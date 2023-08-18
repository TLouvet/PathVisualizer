export class Solver {
    strategy;
    constructor(strategy) {
        this.strategy = strategy;
    }
    solve() {
        this.strategy.solve();
    }
    changeStrategy(strategy) {
        this.strategy = strategy;
    }
    changeSearchComponent(componentType) {
        this.strategy.changeSearchComponent(componentType);
    }
    clear() {
        this.strategy.clear();
    }
}
