import { type Point2D } from '../models/Point2D.interface';

export interface Distance2DStrategy {
  calculate(node1: Point2D, node2: Point2D): number;
}
