export class SolverContext {
    executeSearchStrategy(strategy, start, end) {
        return strategy.solve(start, end);
    }
}
