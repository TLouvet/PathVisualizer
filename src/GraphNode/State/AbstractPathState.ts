import { PathOption } from './PathStateOption.enum';
import { PathState } from './PathState.interface';

export abstract class AbstractPathState implements PathState {
  public path: PathOption;

  constructor(path: PathOption) {
    this.path = path;
  }

  abstract render(node: HTMLDivElement): void;
}
