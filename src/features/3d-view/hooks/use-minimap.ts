import { useEffect, useRef, useCallback } from 'react';
import { PathOption, type GridNodeData } from '@/types/grid-node';
import type { Player } from '../types/raycaster';

interface UseMinimapOptions {
  gridWidth: number;
  gridHeight: number;
  getNode: (row: number, col: number) => GridNodeData | null;
  maxSize?: number;
}

/**
 * Hook to manage minimap rendering for the 3D view
 * Pre-renders the grid and provides a function to draw the player overlay
 */
export function useMinimap(options: UseMinimapOptions) {
  const { gridWidth, gridHeight, getNode, maxSize = 150 } = options;
  const minimapCacheRef = useRef<HTMLCanvasElement | null>(null);

  // Pre-render minimap (only once when grid changes)
  useEffect(() => {
    const aspectRatio = gridWidth / gridHeight;

    let minimapWidth: number;
    let minimapHeight: number;

    if (aspectRatio > 1) {
      // Width is larger
      minimapWidth = maxSize;
      minimapHeight = maxSize / aspectRatio;
    } else {
      // Height is larger or square
      minimapWidth = maxSize * aspectRatio;
      minimapHeight = maxSize;
    }

    const cellSizeX = minimapWidth / gridWidth;
    const cellSizeY = minimapHeight / gridHeight;

    const cache = document.createElement('canvas');
    cache.width = minimapWidth;
    cache.height = minimapHeight;
    const ctx = cache.getContext('2d');
    if (!ctx) return;

    // Draw minimap background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, minimapWidth, minimapHeight);

    // Draw grid cells
    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        const node = getNode(row, col);
        if (!node) continue;

        const x = col * cellSizeX;
        const y = row * cellSizeY;

        if (node.state === PathOption.WALL) {
          ctx.fillStyle = '#666';
        } else if (node.state === PathOption.START) {
          ctx.fillStyle = '#00f';
        } else if (node.state === PathOption.END) {
          ctx.fillStyle = '#0f0';
        } else {
          ctx.fillStyle = '#222';
        }

        ctx.fillRect(x, y, cellSizeX, cellSizeY);
      }
    }

    minimapCacheRef.current = cache;
  }, [gridWidth, gridHeight, getNode, maxSize]);

  // Function to draw the minimap with player overlay
  const drawMinimap = useCallback(
    (ctx: CanvasRenderingContext2D, player: Player, x: number = 10, y: number = 10) => {
      // Draw cached minimap
      if (!minimapCacheRef.current) return;

      const minimapWidth = minimapCacheRef.current.width;
      const minimapHeight = minimapCacheRef.current.height;

      ctx.drawImage(minimapCacheRef.current, x, y);

      // Calculate cell sizes
      const cellSizeX = minimapWidth / gridWidth;
      const cellSizeY = minimapHeight / gridHeight;

      // Draw player position
      const playerMinimapX = x + player.x * cellSizeX;
      const playerMinimapY = y + player.y * cellSizeY;

      ctx.fillStyle = '#ff0';
      ctx.beginPath();
      ctx.arc(playerMinimapX, playerMinimapY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw player direction
      const dirLength = 8;
      const dirX = Math.cos(player.angle) * dirLength;
      const dirY = Math.sin(player.angle) * dirLength;

      ctx.strokeStyle = '#ff0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playerMinimapX, playerMinimapY);
      ctx.lineTo(playerMinimapX + dirX, playerMinimapY + dirY);
      ctx.stroke();
    },
    [gridWidth, gridHeight]
  );

  return { drawMinimap };
}
