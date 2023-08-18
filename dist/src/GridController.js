import { PathNoneState } from './GraphNode/State/PathNoneState.js';
import { Grid } from './Grid.js';
import { PathOption } from './PathOption.enum.js';
import { PathSelectorSingleton } from './PathSelectorSingleton.js';
export class GridController {
    solver;
    constructor(solver) {
        this.solver = solver;
    }
    generateListeners(nodes) {
        nodes.forEach((node) => {
            node.node.addEventListener('click', () => {
                const isUpdatingStartOrEnd = this.isUpdatingStartOrEnd();
                if (isUpdatingStartOrEnd) {
                    this.removeUniqueInstance(nodes, PathOption.START);
                    this.removeUniqueInstance(nodes, PathOption.END);
                }
                node.updatePathState();
                this.recalculateSolution(nodes);
            });
            // TODO Initiate elsewhere
            document.getElementById('grid')?.addEventListener('mousedown', () => {
                Grid.IS_CLICKING = true;
            });
            document.getElementById('grid')?.addEventListener('mouseleave', () => {
                if (Grid.IS_CLICKING) {
                    this.recalculateSolution(nodes);
                    Grid.IS_CLICKING = false;
                }
            });
            document.getElementById('grid')?.addEventListener('dragend', () => {
                console.log('dragend');
                Grid.IS_CLICKING = false;
            });
            document.getElementById('grid')?.addEventListener('mouseup', () => {
                if (Grid.IS_CLICKING) {
                    this.recalculateSolution(nodes);
                    Grid.IS_CLICKING = false;
                }
            });
            node.node.addEventListener('mousemove', () => {
                if ((this.isAddingWall() || this.isRemoving()) && Grid.IS_CLICKING) {
                    node.updatePathState();
                }
            });
        });
    }
    isUpdatingStartOrEnd() {
        return (PathSelectorSingleton.currentPath === PathOption.START || PathSelectorSingleton.currentPath === PathOption.END);
    }
    isAddingWall() {
        return PathSelectorSingleton.currentPath === PathOption.WALL;
    }
    isRemoving() {
        return PathSelectorSingleton.currentPath === PathOption.NONE;
    }
    removeUniqueInstance(nodes, uniquePathOption) {
        if (PathSelectorSingleton.currentPath !== uniquePathOption) {
            return;
        }
        const currentEnd = nodes.find((node) => node.getCurrentPath() === uniquePathOption);
        if (currentEnd) {
            currentEnd.changeState(new PathNoneState());
        }
    }
    recalculateSolution(nodes) {
        for (const node of nodes) {
            if (node.isSolution() || node.isVisited()) {
                node.reinitialize();
            }
        }
        this.solver.clear();
        this.solver.solve();
    }
    reinitializeAll(nodes) {
        this.solver.clear();
        nodes.forEach((node) => node.reinitialize());
    }
}
