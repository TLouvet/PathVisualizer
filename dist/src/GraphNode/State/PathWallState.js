import { PathOption } from './PathStateOption.enum.js';
import { AbstractPathState } from './AbstractPathState.js';
export class PathWallState extends AbstractPathState {
    constructor() {
        super(PathOption.WALL);
    }
    render(node) {
        node.setAttribute('class', 'square path-wall');
    }
}
