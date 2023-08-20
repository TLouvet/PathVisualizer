import { PathOption } from './PathStateOption.enum';
import { AbstractPathState } from './AbstractPathState';

export class PathNoneState extends AbstractPathState {
  constructor() {
    super(PathOption.NONE);
  }

  render(node: HTMLDivElement): void {
    node.setAttribute('class', 'square path-none');
  }
}
