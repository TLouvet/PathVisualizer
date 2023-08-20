import { PathSolutionState } from '../GraphNode/State/PathSolutionState.js';
export class Path {
    nodes;
    constructor() {
        this.nodes = [];
    }
    pop() {
        this.nodes.pop();
    }
    push(node) {
        this.nodes.push(node);
    }
    display() {
        this.nodes.forEach((node) => {
            if (!this.isStartOrEnd(node)) {
                node.changeState(new PathSolutionState());
            }
        });
    }
    isStartOrEnd(node) {
        return node.isStart() || node.isEnd();
    }
}
