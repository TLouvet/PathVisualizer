/**
 * Raycasting engine for 3D maze rendering (Wolfenstein 3D style)
 */

import { PathOption, type GridNodeData } from '@/types/grid-node';
import type { Player, RaycastResult } from '../types/raycaster';

export class Raycaster {
  private gridWidth: number;
  private gridHeight: number;
  private getNode: (row: number, col: number) => GridNodeData | null;

  constructor(
    gridWidth: number,
    gridHeight: number,
    getNode: (row: number, col: number) => GridNodeData | null
  ) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.getNode = getNode;
  }

  /**
   * Cast a single ray and return information about what it hits
   */
  castRay(player: Player, rayAngle: number): RaycastResult {
    const { x, y } = player;

    // Direction vector
    const dirX = Math.cos(rayAngle);
    const dirY = Math.sin(rayAngle);

    // Which box of the map we're in
    let mapX = Math.floor(x);
    let mapY = Math.floor(y);

    // Length of ray from current position to next x or y-side
    let sideDistX: number;
    let sideDistY: number;

    // Length of ray from one x or y-side to next x or y-side
    const deltaDistX = dirX === 0 ? 1e30 : Math.abs(1 / dirX);
    const deltaDistY = dirY === 0 ? 1e30 : Math.abs(1 / dirY);

    // What direction to step in x or y-direction (either +1 or -1)
    let stepX: number;
    let stepY: number;

    let hit = false;
    let side: 'NS' | 'EW' = 'NS'; // Was a NS or a EW wall hit?

    // Calculate step and initial sideDist
    if (dirX < 0) {
      stepX = -1;
      sideDistX = (x - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1.0 - x) * deltaDistX;
    }

    if (dirY < 0) {
      stepY = -1;
      sideDistY = (y - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1.0 - y) * deltaDistY;
    }

    // Perform DDA
    let wallType: PathOption = PathOption.WALL;
    const maxDepth = Math.max(this.gridWidth, this.gridHeight);
    let iterations = 0;

    while (!hit && iterations < maxDepth) {
      // Jump to next map square, either in x-direction, or in y-direction
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 'EW';
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 'NS';
      }

      // Check if ray has hit a wall
      if (mapX < 0 || mapX >= this.gridWidth || mapY < 0 || mapY >= this.gridHeight) {
        hit = true;
        wallType = PathOption.WALL;
      } else {
        const node = this.getNode(mapY, mapX);
        if (node && this.isWall(node.state)) {
          hit = true;
          wallType = node.state;
        }
      }

      iterations++;
    }

    // Calculate distance projected on camera direction
    let perpWallDist: number;
    if (side === 'EW') {
      perpWallDist = sideDistX - deltaDistX;
    } else {
      perpWallDist = sideDistY - deltaDistY;
    }

    // Calculate exact hit position
    let hitX: number, hitY: number;
    if (side === 'EW') {
      hitX = mapX;
      hitY = y + perpWallDist * dirY;
    } else {
      hitX = x + perpWallDist * dirX;
      hitY = mapY;
    }

    return {
      distance: perpWallDist,
      wallType,
      side,
      hitX,
      hitY,
    };
  }

  /**
   * Cast all rays for a frame
   */
  castAllRays(player: Player, screenWidth: number): RaycastResult[] {
    const rays: RaycastResult[] = [];

    // Camera plane calculation for proper perspective without fisheye
    const planeX = Math.cos(player.angle + Math.PI / 2) * Math.tan(player.fov / 2);
    const planeY = Math.sin(player.angle + Math.PI / 2) * Math.tan(player.fov / 2);

    for (let x = 0; x < screenWidth; x++) {
      // Calculate ray position and direction using camera plane
      const cameraX = (2 * x) / screenWidth - 1; // x-coordinate in camera space [-1, 1]

      // Direction vector based on player direction and camera plane
      const rayDirX = Math.cos(player.angle) + planeX * cameraX;
      const rayDirY = Math.sin(player.angle) + planeY * cameraX;
      const rayAngle = Math.atan2(rayDirY, rayDirX);

      const result = this.castRay(player, rayAngle);
      rays.push(result);
    }

    return rays;
  }

  /**
   * Check if a node state represents a wall
   */
  private isWall(state: PathOption): boolean {
    return state === PathOption.WALL;
  }
}
