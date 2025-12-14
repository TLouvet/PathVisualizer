import { useEffect, useRef, useCallback, useState } from 'react';
import { useCanvasGridManager } from '@/contexts/CanvasGridContext';
import { useGridStore } from '@/store/grid-store';
import { PathOption } from '@/types/grid-node';
import { blendColors, adjustBrightness } from '@/shared/utils/color';
import { Raycaster } from '../utils/raycaster';
import { use3DPlayer } from '../hooks/use-3d-player';
import { useMinimap } from '../hooks/use-minimap';
import { useCanvas } from '../hooks/use-canvas';
import { useControlsPanel } from '../hooks/use-controls-panel';
import { isPositionWalkable } from '../utils/collision';

interface MazeView3DProps {
  onExit: () => void;
}

export function MazeView3D({ onExit }: MazeView3DProps) {
  const { canvasRef } = useCanvas();
  const { manager } = useCanvasGridManager();
  const gridWidth = useGridStore((state) => state.gridWidth);
  const gridHeight = useGridStore((state) => state.gridHeight);
  const raycasterRef = useRef<Raycaster | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [hasWon, setHasWon] = useState(false);
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  // Get node function for raycaster and minimap
  const getNode = useCallback((row: number, col: number) => manager?.getNode(row, col) ?? null, [manager]);

  // Minimap
  const { drawMinimap } = useMinimap({
    gridWidth,
    gridHeight,
    getNode,
  });

  // Controls panel
  const { drawControlsPanel } = useControlsPanel();

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
      const node = manager.getNode(row, col);

      return isPositionWalkable(x, y, gridWidth, gridHeight, node);
    },
    [manager, gridWidth, gridHeight]
  );

  const startPos = getStartPosition();
  const { player, playerRef, resetPlayer, enableMouseLook, updatePlayer } = use3DPlayer({
    initialX: startPos.x,
    initialY: startPos.y,
    initialAngle: 0,
    moveSpeed: 2,
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

  // Unified render loop: update player + render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const raycaster = raycasterRef.current;
    if (!canvas || !raycaster) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isActive = true;
    let lastFrameTime = performance.now();

    // Fixed resolution scale for consistent performance
    const resolutionScale = 0.5;

    const render = (currentTime: number) => {
      if (!isActive) return;

      // Calculate delta time and update player
      const deltaTime = (currentTime - lastFrameTime) / 1000;
      lastFrameTime = currentTime;
      updatePlayer(deltaTime);

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

      // Cast rays at reduced resolution (use current player state from ref)
      const currentPlayer = playerRef.current;
      const rays = raycaster.castAllRays(currentPlayer, renderWidth);

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
      drawMinimap(ctx, currentPlayer);

      // Draw controls
      drawControlsPanel(ctx, height);

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
  }, [updatePlayer, drawMinimap, drawControlsPanel]);

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
