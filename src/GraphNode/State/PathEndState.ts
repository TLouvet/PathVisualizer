import { PathOption } from '../../PathOption.enum';
import { AbstractPathState } from './AbstractPathState';

export class PathEndState extends AbstractPathState {
  constructor() {
    super(PathOption.END);
  }

  render(node: HTMLDivElement): void {
    document.querySelectorAll('.path-end').forEach((node) => node.setAttribute('class', 'square path-none'));
    node.setAttribute('class', 'square path-end');
  }
}
