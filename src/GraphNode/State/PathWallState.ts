import { PathOption } from '../../PathOption.enum';
import { AbstractPathState } from './AbstractPathState';

export class PathWallState extends AbstractPathState {
  constructor() {
    super(PathOption.WALL);
  }

  render(node: HTMLDivElement): void {
    node.setAttribute('class', 'square path-wall');
  }
}
