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
    constructor(node, state = new PathNoneState(), parent = null, localValue = Infinity, globalValue = Infinity) {
        this.node = node;
        this.state = state;
        this.parent = parent;
        this.localValue = localValue;
        this.globalValue = globalValue;
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
        this.state.render(this.node);
    }
    getCurrentPath() {
        return this.state.path;
    }
    reinitialize() {
        this.parent = null;
        this.localValue = Infinity;
        this.globalValue = Infinity;
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
