import { PathSolutionState } from '../GraphNode/State/PathSolutionState.js';
// TODO -- il y a peut être besoin d'une interface ici et différentes impl de Path
export class Path {
    isValid;
    nodes;
    constructor() {
        this.nodes = [];
        this.isValid = false;
    }
    pop() {
        this.nodes.pop();
    }
    push(node) {
        this.nodes.push(node);
    }
    display() {
        this.isValid = true;
        this.nodes.forEach((node) => {
            if (this.isStartOrEnd(node)) {
                return;
            }
            node.changeState(new PathSolutionState());
        });
    }
    isStartOrEnd(node) {
        return node.isStart() || node.isEnd();
    }
    clear() {
        this.isValid = false;
        this.nodes = [];
    }
}
