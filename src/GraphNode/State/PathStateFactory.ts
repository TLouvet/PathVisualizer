import { PathOption } from './PathStateOption.enum';
import { PathSelectorSingleton } from '../../PathSelectorSingleton';
import { PathEndState } from './PathEndState';
import { PathNoneState } from './PathNoneState';
import { PathStartState } from './PathStartState';
import { PathState } from './PathState.interface';
import { PathWallState } from './PathWallState';

export class PathStateFactory {
  static getState(): PathState {
    switch (PathSelectorSingleton.currentPath) {
      case PathOption.END:
        return new PathEndState();
      case PathOption.START:
        return new PathStartState();
      case PathOption.WALL:
        return new PathWallState();
      default:
        return new PathNoneState();
    }
  }
}
