import { PathOption } from './PathStateOption.enum';

export interface PathState {
  render(node: HTMLDivElement): void;
  path: PathOption;
}
