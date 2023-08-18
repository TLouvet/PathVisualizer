import { PathOption } from '../../PathOption.enum';
import { AbstractPathState } from './AbstractPathState';

export class PathSolutionState extends AbstractPathState {
  constructor() {
    super(PathOption.SOLUTION);
  }

  render(node: HTMLDivElement): void {
    node.setAttribute('class', 'square path-solution');
  }
}
