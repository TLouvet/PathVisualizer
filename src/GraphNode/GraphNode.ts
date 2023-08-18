import { PathOption } from '../PathOption.enum';
import { PathSelectorSingleton } from '../PathSelectorSingleton';
import { PathNoneState } from './State/PathNoneState';
import { PathState } from './State/PathState.interface';
import { PathStateFactory } from './State/PathStateFactory';

export class GraphNode {
  constructor(
    public node: HTMLDivElement,
    private state: PathState = new PathNoneState(),
    public parent: GraphNode | null = null,
    public localValue = Infinity,
    public globalValue = Infinity
  ) {}

  updatePathState(): void {
    if (this.state.path === PathSelectorSingleton.currentPath) {
      return;
    }
    const newPathState = PathStateFactory.getState();
    return this.changeState(newPathState);
  }

  changeState(newState: PathState): void {
    this.state = newState;
    this.state.render(this.node);
  }

  getCurrentPath(): PathOption {
    return this.state.path;
  }

  reinitialize() {
    this.parent = null;
    this.localValue = Infinity;
    this.globalValue = Infinity;
    this.changeState(new PathNoneState());
  }

  isStart(): boolean {
    return this.state.path === PathOption.START;
  }

  isEnd(): boolean {
    return this.state.path === PathOption.END;
  }

  isSolution(): boolean {
    return this.state.path === PathOption.SOLUTION;
  }

  isVisited(): boolean {
    return this.state.path === PathOption.VISITED;
  }

  isEmpty(): boolean {
    return this.state.path === PathOption.NONE;
  }

  render() {
    this.state.render(this.node);
  }
}
