import { type Distance2DStrategy } from './distance-2d.strategy';
import { type Point2D } from '../models/Point2D.interface';

export class EuclidianDistance implements Distance2DStrategy {
  calculate(startNode: Point2D, endNode: Point2D): number {
    const dx = endNode.col - startNode.col;
    const dy = endNode.row - startNode.row;

    return Math.sqrt(dx * dx + dy * dy);
  }
}
