import { PathEndState } from '../GraphNode/State/PathEndState.js';
import { PathStartState } from '../GraphNode/State/PathStartState.js';
import { PathVisitedState } from '../GraphNode/State/PathVisitedState.js';
import { AbstractSearchStrategy } from './AbstractSearchStrategy.js';
export class BFSStrategy extends AbstractSearchStrategy {
    solve(start, end) {
        this.performanceMonitorComponent.start();
        if (!start || !end)
            return;
        if (!this.bfs(start, end)) {
            console.log('No path found using BFS');
        }
        this.performanceMonitorComponent.display();
    }
    bfs(start, end) {
        const queue = [start];
        while (queue.length > 0) {
            const currentGraphNode = queue.shift();
            if (currentGraphNode.row === end.row && currentGraphNode.col === end.col) {
                let node = currentGraphNode;
                while (node?.parent) {
                    this.path.push(node);
                    node = node.parent;
                }
                this.path.push(node);
                this.path.display();
                start.changeState(new PathStartState()); // We have overidden this state on the first pass, but as we do not want to check for this all turns, we put back the original state
                end.changeState(new PathEndState()); // same as above
                return true;
            }
            const adjacentNodes = this.searchComponent.getAdjacentNodes(currentGraphNode);
            adjacentNodes.forEach((node) => {
                node.parent = currentGraphNode;
                node.changeState(new PathVisitedState()); // with a discovered state, we could avoid that and simplify the algorithm
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
