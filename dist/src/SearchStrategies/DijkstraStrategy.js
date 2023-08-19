import { DijkstraMinBinaryHeap } from '../DataStructure/DijkstraMinHeap.js';
import { PathStartState } from '../GraphNode/State/PathStartState.js';
import { PathVisitedState } from '../GraphNode/State/PathVisitedState.js';
import { PathOption } from '../PathOption.enum.js';
import { AbstractSearchStrategy } from './AbstractSearchStrategy.js';
export class DijkstraStrategy extends AbstractSearchStrategy {
    heap = new DijkstraMinBinaryHeap();
    solve(start, end) {
        this.performanceMonitorComponent.start();
        if (!start || !end)
            return;
        if (!this.dijkstra(start, end)) {
            console.log('No path found using Dijkstra');
        }
        this.performanceMonitorComponent.display();
    }
    dijkstra(start, end) {
        start.localValue = 0;
        this.heap.insert(start);
        while (!this.heap.isEmpty()) {
            const currentNode = this.heap.extractMin();
            // if this node is the end node then we can stop the algorithm
            if (currentNode.getCurrentPath() === PathOption.END) {
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
            for (const adjacentNode of adjacentNodes) {
                const distance = this.getEuclidianDistance(currentNode, adjacentNode);
                if (adjacentNode.localValue > currentNode.localValue + distance) {
                    adjacentNode.localValue = currentNode.localValue + distance;
                    adjacentNode.parent = currentNode;
                    this.heap.insert(adjacentNode);
                }
            }
            currentNode.changeState(new PathVisitedState());
        }
        start.changeState(new PathStartState()); // We have overidden this state on the first pass, but as we do not want to check for this all turns, we put back the original state
        return false;
    }
    getEuclidianDistance(currentNode, endNode) {
        const [currentX, currentY] = currentNode.node.id.substring(1).split('-').map(Number);
        const [endX, endY] = endNode.node.id.substring(1).split('-').map(Number);
        return Math.sqrt(Math.pow(currentX - endX, 2) + Math.pow(currentY - endY, 2));
    }
}
