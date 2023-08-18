import { PathOption } from '../../PathOption.enum.js';
import { AbstractPathState } from './AbstractPathState.js';
export class PathSolutionState extends AbstractPathState {
    constructor() {
        super(PathOption.SOLUTION);
    }
    render(node) {
        node.setAttribute('class', 'square path-solution');
    }
}
