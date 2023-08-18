import { PathStartState } from '../GraphNode/State/PathStartState.js';
import { PathVisitedState } from '../GraphNode/State/PathVisitedState.js';
import { AbstractSearchStrategy } from './AbstractSearchStrategy.js';
export class BFSStrategy extends AbstractSearchStrategy {
    solve() {
        this.performanceMonitorComponent.start();
        const start = this.nodes.find((node) => node.isStart());
        const end = this.nodes.find((node) => node.isEnd());
        if (!start || !end)
            return;
        if (!this.bfs(start, end)) {
            this.path.isValid = false;
            console.log('No path found using BFS');
        }
        this.performanceMonitorComponent.display();
    }
    bfs(start, end) {
        const queue = [start];
        while (queue.length > 0) {
            const currentGraphNode = queue.shift();
            const adjacentNodes = this.searchComponent.getAdjacentNodes(currentGraphNode);
            adjacentNodes.forEach((node) => (node.parent = currentGraphNode));
            // A refactor
            if (this.endNodeIsFound(adjacentNodes)) {
                let node = adjacentNodes.find((node) => node.isEnd());
                while (node?.parent) {
                    this.path.push(node);
                    node = node.parent;
                }
                this.path.push(node);
                this.path.display();
                start.changeState(new PathStartState()); // We have overidden this state on the first pass, but as we do not want to check for this all turns, we put back the original state
                return true;
            }
            adjacentNodes.forEach((node) => {
                node.changeState(new PathVisitedState());
            });
            queue.push(...adjacentNodes);
            currentGraphNode.changeState(new PathVisitedState());
        }
        start.changeState(new PathStartState()); // We have overidden this state on the first pass, but as we do not want to check for this all turns, we put back the original state
        return false;
    }
    endNodeIsFound(nodes) {
        return nodes.some((node) => node.isEnd());
    }
}
