import type { PathOption } from '@/types/grid-node';

export interface RaycastResult {
  distance: number;
  wallType: PathOption;
  side: 'NS' | 'EW'; // North-South or East-West wall
  hitX: number; // Exact X coordinate where ray hit
  hitY: number; // Exact Y coordinate where ray hit
}

export interface Player {
  x: number; // X position in grid coordinates
  y: number; // Y position in grid coordinates
  angle: number; // View angle in radians
  fov: number; // Field of view in radians
}
