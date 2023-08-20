import { Grid } from './Grid.js';
export class GridController {
    solver;
    constructor(solver) {
        this.solver = solver;
    }
    recalculateSolution(strategy, nodes) {
        for (const node of nodes) {
            node.reinitialize();
            if (node.isSolution() || node.isVisited()) {
                node.setNoneState();
            }
        }
        this.solver.executeStrategy(strategy, Grid.START_NODE, Grid.END_NODE);
    }
    reinitializeAll(nodes) {
        nodes.forEach((node) => {
            node.reinitialize();
            node.setNoneState();
        });
    }
}
