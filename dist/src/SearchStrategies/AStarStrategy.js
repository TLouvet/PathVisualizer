import { MinBinaryHeap } from '../DataStructure/MinHeap.js';
import { PathStartState } from '../GraphNode/State/PathStartState.js';
import { PathVisitedState } from '../GraphNode/State/PathVisitedState.js';
import { AbstractSearchStrategy } from './AbstractSearchStrategy.js';
export class AStarStrategy extends AbstractSearchStrategy {
    heap = new MinBinaryHeap('globalValue');
    solve(start, end) {
        this.performanceMonitorComponent.start();
        if (!start || !end)
            return;
        this.astar(start, end);
        this.performanceMonitorComponent.display();
    }
    astar(start, end) {
        start.localValue = 0;
        start.globalValue = this.searchComponent.getDistance(start, end);
        this.heap.insert(start);
        while (!this.heap.isEmpty()) {
            const currentNode = this.heap.extractMin();
            // If we find the end node we return true -- this breaks the a* algorithm ad we don't automatically get the shortest path
            // It does not matter in our grid implementation because the distances are all the same but would matter in a graph with different weights
            if (currentNode.isEnd()) {
                // Here we should just have a continue statement
                let node = currentNode;
                while (node?.parent) {
                    this.path.push(node);
                    node = node.parent;
                }
                this.path.push(node);
                this.path.display();
                start.changeState(new PathStartState()); // We have overidden this state on the first pass, but as we do not want to check for this all turns, we put back the original state
                return true;
            }
            const adjacentNodes = this.searchComponent.getAdjacentNodes(currentNode);
            for (const node of adjacentNodes) {
                const manhattanDistance = this.searchComponent.getDistance(currentNode, node); // Ca c'est ce qui ralentit le plus dans cette boucle, mais c'est aussi ce qu'on peut précalculer
                if (node.localValue > currentNode.localValue + manhattanDistance) {
                    node.localValue = currentNode.localValue + manhattanDistance;
                    node.parent = currentNode;
                    node.globalValue = node.localValue + this.searchComponent.getDistance(node, end);
                    this.heap.insert(node);
                }
            }
            currentNode.changeState(new PathVisitedState());
        }
        start.changeState(new PathStartState()); // We have overidden this state on the first pass, but as we do not want to check for this all turns, we put back the original state
        return false;
    }
}
