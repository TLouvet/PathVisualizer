import { PathOption } from '../../PathOption.enum.js';
import { AbstractPathState } from './AbstractPathState.js';
export class PathNoneState extends AbstractPathState {
    constructor() {
        super(PathOption.NONE);
    }
    render(node) {
        node.setAttribute('class', 'square path-none');
    }
}
