import { PathOption } from '../../PathOption.enum';
import { AbstractPathState } from './AbstractPathState';

export class PathStartState extends AbstractPathState {
  constructor() {
    super(PathOption.START);
  }

  render(node: HTMLDivElement): void {
    document.querySelectorAll('.path-start').forEach((node) => node.setAttribute('class', 'square path-none'));
    node.setAttribute('class', 'square path-start');
  }
}
