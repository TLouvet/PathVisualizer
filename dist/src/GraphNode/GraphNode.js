import { Grid } from '../Grid.js';
import { PathOption } from '../PathOption.enum.js';
import { PathSelectorSingleton } from '../PathSelectorSingleton.js';
import { PathNoneState } from './State/PathNoneState.js';
import { PathStateFactory } from './State/PathStateFactory.js';
export class GraphNode {
    node;
    state;
    parent;
    localValue;
    globalValue;
    row;
    col;
    constructor(node, state = new PathNoneState(), parent = null, localValue = Infinity, globalValue = Infinity) {
        this.node = node;
        this.state = state;
        this.parent = parent;
        this.localValue = localValue;
        this.globalValue = globalValue;
        const [row, col] = this.node.id.substring(1).split('-').map(Number);
        this.row = row;
        this.col = col;
    }
    updatePathState() {
        if (this.state.path === PathSelectorSingleton.currentPath) {
            return;
        }
        const newPathState = PathStateFactory.getState();
        return this.changeState(newPathState);
    }
    changeState(newState) {
        this.state = newState;
        if (this.isStart()) {
            Grid.START_NODE = this;
        }
        if (this.isEnd()) {
            Grid.END_NODE = this;
        }
        this.state.render(this.node);
    }
    getCurrentPath() {
        return this.state.path;
    }
    reinitialize() {
        this.parent = null;
        this.localValue = Infinity;
        this.globalValue = Infinity;
    }
    setNoneState() {
        this.changeState(new PathNoneState());
    }
    isStart() {
        return this.state.path === PathOption.START;
    }
    isEnd() {
        return this.state.path === PathOption.END;
    }
    isSolution() {
        return this.state.path === PathOption.SOLUTION;
    }
    isVisited() {
        return this.state.path === PathOption.VISITED;
    }
    isEmpty() {
        return this.state.path === PathOption.NONE;
    }
    render() {
        this.state.render(this.node);
    }
}
