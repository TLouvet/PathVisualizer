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
    changeSearchComponent() {
        this.strategy.changeSearchComponent();
    }
    clear() {
        this.strategy.clear();
    }
}
