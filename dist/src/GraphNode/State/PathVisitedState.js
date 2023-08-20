import { Grid } from '../../Grid.js';
import { PathOption } from './PathStateOption.enum.js';
import { AbstractPathState } from './AbstractPathState.js';
export class PathVisitedState extends AbstractPathState {
    constructor() {
        super(PathOption.VISITED);
    }
    render(node) {
        if (Grid.showVisitedNodes) {
            node.setAttribute('class', 'square path-visited');
        }
        else {
            node.setAttribute('class', 'square');
        }
    }
}
