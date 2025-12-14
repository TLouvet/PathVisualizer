import { type Point2D } from '../models/Point2D.interface';
import { type Distance2DStrategy } from './distance-2d.strategy';

export class ManhattanDistance implements Distance2DStrategy {
  calculate(startNode: Point2D, endNode: Point2D): number {
    const dx = Math.abs(endNode.col - startNode.col);
    const dy = Math.abs(endNode.row - startNode.row);

    return dx + dy;
  }
}
