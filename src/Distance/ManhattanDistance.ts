import { Point2D } from '../Point2D/Point2D.interface';
import { Distance2D } from './Distance.interface';

export class ManhattanDistance implements Distance2D {
  calculate(startNode: Point2D, endNode: Point2D): number {
    const { row: row1, col: col1 } = startNode;
    const { row: row2, col: col2 } = endNode;

    return Math.abs(row1 - row2) + Math.abs(col1 - col2);
  }
}
