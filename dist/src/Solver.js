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
    clear() {
        this.strategy.clear();
    }
}
