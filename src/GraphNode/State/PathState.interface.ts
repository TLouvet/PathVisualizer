import { PathOption } from '../../PathOption.enum';

export interface PathState {
  render(node: HTMLDivElement): void;
  path: PathOption;
}
