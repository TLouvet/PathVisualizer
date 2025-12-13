import { type Distance2D } from './Distance.interface';
import { type Point2D } from '../models/Point2D.interface';

export class EuclidianDistance implements Distance2D {
  calculate(startNode: Point2D, endNode: Point2D): number {
    const { row: row1, col: col1 } = startNode;
    const { row: row2, col: col2 } = endNode;

    return Math.sqrt(Math.pow(row2 - row1, 2) + Math.pow(col2 - col1, 2));
  }
}
