import { PathOption } from './State/PathStateOption.enum';
import { PathSelectorSingleton } from '../PathSelectorSingleton';
import { Point2D } from '../Point2D/Point2D.interface';
import { PathNoneState } from './State/PathNoneState';
import { PathState } from './State/PathState.interface';
import { PathStateFactory } from './State/PathStateFactory';

export class GraphNode implements Point2D {
  public row: number;
  public col: number;

  constructor(
    public node: HTMLDivElement,
    private state: PathState = new PathNoneState(),
    public parent: GraphNode | null = null,
    public localValue = Infinity,
    public globalValue = Infinity
  ) {
    const [row, col] = this.node.id.substring(1).split('-').map(Number);
    this.row = row;
    this.col = col;
  }

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
  }

  setNoneState() {
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
