import { useEffect, useRef, useCallback, useState } from 'react';
import { useCanvasGridManager } from '../../contexts/CanvasGridContext';
import { useGridStore } from '../../store/grid-store';
import { Raycaster } from '../../utils/raycaster';
import { use3DPlayer } from '../../hooks/use3DPlayer';
import { PathOption } from '../../types/grid-node';

interface MazeView3DProps {
  onExit: () => void;
}

export function MazeView3D({ onExit }: MazeView3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { manager } = useCanvasGridManager();
  const gridWidth = useGridStore((state) => state.gridWidth);
  const gridHeight = useGridStore((state) => state.gridHeight);
  const raycasterRef = useRef<Raycaster | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [hasWon, setHasWon] = useState(false);
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  // Pre-rendered minimap cache
  const minimapCacheRef = useRef<HTMLCanvasElement | null>(null);

  // Get node function for raycaster
  const getNode = useCallback(
    (row: number, col: number) => {
      if (!manager) return null;
      return manager.getNode(row, col);
    },
    [manager]
  );

  // Initialize raycaster
  useEffect(() => {
    raycasterRef.current = new Raycaster(gridWidth, gridHeight, getNode);
  }, [gridWidth, gridHeight, getNode]);

  // Find start position
  const getStartPosition = useCallback(() => {
    if (!manager?.startNode) {
      return { x: gridWidth / 2, y: gridHeight / 2 };
    }
    return {
      x: manager.startNode.col + 0.5,
      y: manager.startNode.row + 0.5,
    };
  }, [manager, gridWidth, gridHeight]);

  // Check if player can move to position
  const canMove = useCallback(
    (x: number, y: number) => {
      if (!manager) return false;

      const col = Math.floor(x);
      const row = Math.floor(y);

      if (col < 0 || col >= gridWidth || row < 0 || row >= gridHeight) {
        return false;
      }

      const node = manager.getNode(row, col);
      if (!node) return false;

      return node.state !== PathOption.WALL;
    },
    [manager, gridWidth, gridHeight]
  );

  const startPos = getStartPosition();
  const { player, resetPlayer, enableMouseLook } = use3DPlayer({
    initialX: startPos.x,
    initialY: startPos.y,
    initialAngle: 0,
    moveSpeed: 2,
    rotateSpeed: 1.5,
    canMove,
  });

  // Track pointer lock state
  useEffect(() => {
    const handlePointerLockChange = () => {
      setIsPointerLocked(document.pointerLockElement !== null);
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, []);

  // Enable pointer lock on canvas click
  const handleCanvasClick = useCallback(() => {
    if (canvasRef.current) {
      enableMouseLook(canvasRef.current);
    }
  }, [enableMouseLook]);

  // Pause 2D canvas rendering when in 3D view
  useEffect(() => {
    if (!manager) return;

    // Pause the 2D canvas render loop since we're in 3D view
    manager.pause();

    // Resume when exiting 3D view
    return () => {
      manager.resume();
      // Disable culling when back in 2D view
      manager.setRenderRadius(null);
    };
  }, [manager]);

  // Enable viewport culling and sync player position with canvas manager
  useEffect(() => {
    if (!manager) return;

    // Enable culling with 10 cell radius around player
    manager.setRenderRadius(10);

    // Update focal point as player moves
    const playerCol = Math.floor(player.x);
    const playerRow = Math.floor(player.y);
    manager.setFocalPoint(playerRow, playerCol);
  }, [manager, player.x, player.y]);

  // Check if player reached the end
  useEffect(() => {
    if (!manager?.endNode || hasWon) return;

    const endCol = manager.endNode.col;
    const endRow = manager.endNode.row;
    const playerCol = Math.floor(player.x);
    const playerRow = Math.floor(player.y);

    if (playerCol === endCol && playerRow === endRow) {
      setHasWon(true);
      setTimeout(() => {
        alert('🎉 Congratulations! You found the exit!');
        onExit();
      }, 100);
    }
  }, [player.x, player.y, manager, onExit, hasWon]);

  // Pre-render minimap (only once)
  useEffect(() => {
    if (!manager) return;

    const minimapMaxSize = 150;
    const aspectRatio = gridWidth / gridHeight;

    let minimapWidth: number;
    let minimapHeight: number;

    if (aspectRatio > 1) {
      // Width is larger
      minimapWidth = minimapMaxSize;
      minimapHeight = minimapMaxSize / aspectRatio;
    } else {
      // Height is larger or square
      minimapWidth = minimapMaxSize * aspectRatio;
      minimapHeight = minimapMaxSize;
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
        const node = manager.getNode(row, col);
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
  }, [manager, gridWidth, gridHeight]);

  // Render the 3D view
  useEffect(() => {
    const canvas = canvasRef.current;
    const raycaster = raycasterRef.current;
    if (!canvas || !raycaster) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isActive = true;

    // Fixed resolution scale for consistent performance
    const resolutionScale = 0.5;

    const drawMinimap = (ctx: CanvasRenderingContext2D) => {
      const minimapX = 10;
      const minimapY = 10;

      // Draw cached minimap
      if (!minimapCacheRef.current) return;

      const minimapWidth = minimapCacheRef.current.width;
      const minimapHeight = minimapCacheRef.current.height;

      ctx.drawImage(minimapCacheRef.current, minimapX, minimapY);

      // Calculate cell sizes
      const cellSizeX = minimapWidth / gridWidth;
      const cellSizeY = minimapHeight / gridHeight;

      // Draw player position
      const playerMinimapX = minimapX + player.x * cellSizeX;
      const playerMinimapY = minimapY + player.y * cellSizeY;

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
    };

    const drawControls = (ctx: CanvasRenderingContext2D, screenHeight: number) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, screenHeight - 105, 280, 95);

      ctx.fillStyle = '#fff';
      ctx.font = '14px monospace';
      ctx.fillText('Controls:', 20, screenHeight - 80);
      ctx.fillText('W/Z/↑: Move Forward', 20, screenHeight - 60);
      ctx.fillText('S/↓: Move Backward', 20, screenHeight - 45);
      ctx.fillText('Q/A: Strafe Left', 20, screenHeight - 30);
      ctx.fillText('D: Strafe Right', 20, screenHeight - 15);
    };

    const render = () => {
      if (!isActive) return;

      const width = canvas.width;
      const height = canvas.height;
      const renderWidth = Math.floor(width * resolutionScale);

      // Draw ceiling with gradient
      const ceilingGradient = ctx.createLinearGradient(0, 0, 0, height / 2);
      ceilingGradient.addColorStop(0, '#3a3a3a');
      ceilingGradient.addColorStop(1, '#2a2a2a');
      ctx.fillStyle = ceilingGradient;
      ctx.fillRect(0, 0, width, height / 2);

      // Draw floor with gradient
      const floorGradient = ctx.createLinearGradient(0, height / 2, 0, height);
      floorGradient.addColorStop(0, '#1a1a1a');
      floorGradient.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = floorGradient;
      ctx.fillRect(0, height / 2, width, height / 2);

      // Add simple floor texture
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for (let i = height / 2; i < height; i += 20) {
        ctx.fillRect(0, i, width, 1);
      }

      // Cast rays at reduced resolution
      const rays = raycaster.castAllRays(player, renderWidth);

      // Draw walls with scaling
      const scale = width / renderWidth;

      rays.forEach((ray, x) => {
        const { distance, wallType, side } = ray;
        const wallHeight = Math.min((height / distance) * 0.5, height);
        const wallTop = (height - wallHeight) / 2;

        // Choose base color
        let baseColor = '#666';
        if (wallType === PathOption.WALL) {
          baseColor = '#8b7355';
        } else if (wallType === PathOption.END) {
          baseColor = '#22c55e';
        } else if (wallType === PathOption.START) {
          baseColor = '#3b82f6';
        } else if (wallType === PathOption.VISITED) {
          baseColor = '#f59e0b';
        } else if (wallType === PathOption.SOLUTION) {
          baseColor = '#06b6d4';
        }

        // Apply side shading
        const sideFactor = side === 'NS' ? 0.7 : 1;
        const shadedColor = adjustBrightness(baseColor, sideFactor);

        // Apply distance fog
        const fogFactor = Math.min(distance / 15, 1);
        const foggedColor = blendColors(shadedColor, '#0a0a0a', fogFactor);

        ctx.fillStyle = foggedColor;
        ctx.fillRect(x * scale, wallTop, scale + 1, wallHeight);
      });

      // Draw minimap
      drawMinimap(ctx);

      // Draw controls
      drawControls(ctx, height);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      isActive = false;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [player, gridWidth, gridHeight, manager]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = globalThis.innerWidth;
      canvas.height = globalThis.innerHeight;
    };

    resize();
    globalThis.addEventListener('resize', resize);

    return () => {
      globalThis.removeEventListener('resize', resize);
    };
  }, []);

  // Reset player position when start node changes (only when start node actually changes)
  useEffect(() => {
    const pos = getStartPosition();
    resetPlayer(pos.x, pos.y, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager?.startNode?.row, manager?.startNode?.col]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, []);

  return (
    <div className='fixed inset-0 z-50 bg-black'>
      <canvas
        ref={canvasRef}
        className='w-full h-full cursor-crosshair'
        onClick={handleCanvasClick}
        title='Click to enable mouse look'
      />
      <button
        onClick={onExit}
        className='absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-lg z-10'
      >
        Exit 3D View
      </button>
      <div className='absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-2 rounded text-sm'>
        {isPointerLocked ? 'Press ESC to release mouse' : 'Click to enable mouse look'}
      </div>
    </div>
  );
}

// Helper function to blend two hex colors
function blendColors(color1: string, color2: string, ratio: number): string {
  const r1 = Number.parseInt(color1.substring(1, 3), 16);
  const g1 = Number.parseInt(color1.substring(3, 5), 16);
  const b1 = Number.parseInt(color1.substring(5, 7), 16);

  const r2 = Number.parseInt(color2.substring(1, 3), 16);
  const g2 = Number.parseInt(color2.substring(3, 5), 16);
  const b2 = Number.parseInt(color2.substring(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Helper function to adjust brightness
function adjustBrightness(color: string, factor: number): string {
  const r = Number.parseInt(color.substring(1, 3), 16);
  const g = Number.parseInt(color.substring(3, 5), 16);
  const b = Number.parseInt(color.substring(5, 7), 16);

  const newR = Math.round(Math.min(255, r * factor));
  const newG = Math.round(Math.min(255, g * factor));
  const newB = Math.round(Math.min(255, b * factor));

  return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
}
