import { GraphNode } from '../../GraphNode/GraphNode';
import { Point2D } from '../../Point2D/Point2D.interface';

export interface ISearchComponent {
  getAdjacentNodes(currentNode: Point2D): GraphNode[];
  getDistance(currentNode: Point2D, endNode: Point2D): number;
}
