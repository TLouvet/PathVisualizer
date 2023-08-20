import { PathOption } from './PathStateOption.enum.js';
import { PathSelectorSingleton } from '../../PathSelectorSingleton.js';
import { PathEndState } from './PathEndState.js';
import { PathNoneState } from './PathNoneState.js';
import { PathStartState } from './PathStartState.js';
import { PathWallState } from './PathWallState.js';
export class PathStateFactory {
    static getState() {
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
