import { PathEndState } from '../GraphNode/State/PathEndState.js';
import { PathVisitedState } from '../GraphNode/State/PathVisitedState.js';
import { AbstractSearchStrategy } from './AbstractSearchStrategy.js';
export class DFSStrategy extends AbstractSearchStrategy {
    solve(start, end) {
        this.performanceMonitorComponent.start();
        if (!start || !end) {
            return;
        }
        // TODO -- render on screen the message
        if (!this.dfs(start, end)) {
            console.log('No Valid Path found');
        }
        this.performanceMonitorComponent.display();
    }
    dfs(start, end) {
        if (start.node.id === end.node.id) {
            this.path.display();
            end.changeState(new PathEndState());
            return true;
        }
        const adjacentNodes = this.searchComponent.getAdjacentNodes(start);
        adjacentNodes.sort((a, b) => this.searchComponent.getDistance(a, end) - this.searchComponent.getDistance(b, end));
        for (const node of adjacentNodes) {
            node.changeState(new PathVisitedState());
            this.path.push(node);
            if (this.dfs(node, end)) {
                return true;
            }
            this.path.pop();
        }
        return false;
    }
}
