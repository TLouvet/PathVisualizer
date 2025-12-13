import { type Point2D } from '../models/Point2D.interface';

export interface Distance2D {
  calculate(node1: Point2D, node2: Point2D): number;
}
