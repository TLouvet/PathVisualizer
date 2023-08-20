import { GridGenerator } from './GridGenerator.js';
import { SolverContext } from './Solver.js';
import { PathOption } from './GraphNode/State/PathStateOption.enum.js';
import { PathSelectorSingleton } from './PathSelectorSingleton.js';
import { PathNoneState } from './GraphNode/State/PathNoneState.js';
import { GridSearchDirectionSelector } from './Grid/GridSearchDirectionSelector.js';
import { GridSearchStrategySelector } from './Grid/GridSearchStrategySelector.js';
export class Grid {
    static showVisitedNodes = false;
    directionSelector;
    searchSelector;
    solver;
    gridHTMLGenerator;
    nodes;
    startNode = null;
    endNode = null;
    isClicking = false;
    constructor() {
        this.directionSelector = new GridSearchDirectionSelector();
        this.searchSelector = new GridSearchStrategySelector();
        this.gridHTMLGenerator = new GridGenerator();
        this.solver = new SolverContext();
        this.nodes = [];
        // finalement ça ne touche que le pathstate visited
        document.getElementById('btn-show-visited')?.addEventListener('click', () => {
            Grid.showVisitedNodes = !Grid.showVisitedNodes;
            this.render();
        });
        document.getElementById('btn-path-reinitialize')?.addEventListener('click', () => this.reinitializeAll());
    }
    generate() {
        this.directionSelector.initListeners(this);
        this.searchSelector.initListeners(this);
        this.nodes = this.gridHTMLGenerator.injectIntoBody();
        this.generateListeners(this.nodes);
    }
    // Ca c'est assez mauvais, le nom n'est pas explicite et on ne comprend pas trop le pourquoi du comment
    render() {
        this.nodes.forEach((node) => {
            if (node.getCurrentPath() === PathOption.VISITED) {
                node.render();
            }
        });
    }
    /////
    generateListeners(nodes) {
        nodes.forEach((node) => {
            node.node.addEventListener('click', () => {
                const isUpdatingStartOrEnd = this.isUpdatingStartOrEnd();
                // could be made better
                if (isUpdatingStartOrEnd) {
                    this.removeUniqueInstance(nodes, PathOption.START);
                    this.removeUniqueInstance(nodes, PathOption.END);
                }
                if (PathSelectorSingleton.currentPath === PathOption.START) {
                    this.startNode = node;
                }
                else if (PathSelectorSingleton.currentPath === PathOption.END) {
                    this.endNode = node;
                }
                // Qu'est ce qu'il se passe si je suis en train de remove tho ??
                if (PathSelectorSingleton.currentPath === PathOption.NONE) {
                    if (node.getCurrentPath() === PathOption.START) {
                        this.startNode = null;
                    }
                    else if (node.getCurrentPath() === PathOption.END) {
                        this.endNode = null;
                    }
                }
                node.updatePathState();
                this.recalculateSolution();
            });
            // TODO Initiate elsewhere
            document.getElementById('grid')?.addEventListener('mousedown', () => {
                this.isClicking = true;
            });
            document.getElementById('grid')?.addEventListener('mouseleave', () => {
                if (this.isClicking) {
                    this.recalculateSolution();
                    this.isClicking = false;
                }
            });
            document.getElementById('grid')?.addEventListener('dragend', () => {
                if (this.isClicking) {
                    this.isClicking = false;
                    this.recalculateSolution();
                }
            });
            document.getElementById('grid')?.addEventListener('mouseup', () => {
                if (this.isClicking) {
                    this.isClicking = false;
                    this.recalculateSolution();
                }
            });
            node.node.addEventListener('mousemove', () => {
                if ((this.isAddingWall() || this.isRemoving()) && this.isClicking) {
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
    recalculateSolution() {
        for (const node of this.nodes) {
            node.reinitialize();
            if (node.isSolution() || node.isVisited()) {
                node.setNoneState();
            }
        }
        const strategy = this.searchSelector.getStrategy(this.nodes);
        this.solver.executeSearchStrategy(strategy, this.startNode, this.endNode);
    }
    reinitializeAll() {
        this.nodes.forEach((node) => {
            node.reinitialize();
            node.setNoneState();
        });
        this.startNode = null;
        this.endNode = null;
    }
}
