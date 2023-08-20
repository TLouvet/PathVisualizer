import { PathOption } from './PathStateOption.enum.js';
import { AbstractPathState } from './AbstractPathState.js';
export class PathEndState extends AbstractPathState {
    constructor() {
        super(PathOption.END);
    }
    render(node) {
        document.querySelectorAll('.path-end').forEach((node) => node.setAttribute('class', 'square path-none'));
        node.setAttribute('class', 'square path-end');
    }
}
