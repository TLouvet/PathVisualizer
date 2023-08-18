import { PathOption } from '../../PathOption.enum.js';
import { AbstractPathState } from './AbstractPathState.js';
export class PathStartState extends AbstractPathState {
    constructor() {
        super(PathOption.START);
    }
    render(node) {
        document.querySelectorAll('.path-start').forEach((node) => node.setAttribute('class', 'square path-none'));
        node.setAttribute('class', 'square path-start');
    }
}
