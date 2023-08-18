import { Grid } from '../../Grid';
import { PathOption } from '../../PathOption.enum';
import { AbstractPathState } from './AbstractPathState';

export class PathVisitedState extends AbstractPathState {
  constructor() {
    super(PathOption.VISITED);
  }

  render(node: HTMLDivElement): void {
    if (Grid.showVisitedNodes) {
      node.setAttribute('class', 'square path-visited');
    } else {
      node.setAttribute('class', 'square');
    }
  }
}
