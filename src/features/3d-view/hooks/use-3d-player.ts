import { useEffect, useRef, useCallback } from 'react';
import type { Player } from '../types/raycaster';
import { usePlayerKeyboardInput } from './use-player-keyboard-input';
import { usePlayerMouseInput } from './use-player-mouse-input';
import { calculatePlayerMovement } from '../utils/player-movement';

interface Use3DPlayerOptions {
  initialX: number;
  initialY: number;
  initialAngle?: number;
  moveSpeed?: number;
  canMove?: (x: number, y: number) => boolean;
}

export function use3DPlayer(options: Use3DPlayerOptions) {
  const { initialX, initialY, initialAngle = 0, moveSpeed = 5, canMove = () => true } = options;

  const playerRef = useRef<Player>({
    x: initialX,
    y: initialY,
    angle: initialAngle,
    fov: Math.PI / 2, // 90 degrees
  });

  const keyState = usePlayerKeyboardInput();
  const { mouseRotationRef, enableMouseLook } = usePlayerMouseInput();

  const canMoveRef = useRef(canMove);
  const moveSpeedRef = useRef(moveSpeed);

  // Keep refs up to date
  useEffect(() => {
    canMoveRef.current = canMove;
    moveSpeedRef.current = moveSpeed;
  }, [canMove, moveSpeed]);

  // Reset player position
  const resetPlayer = useCallback((x: number, y: number, angle: number = 0) => {
    playerRef.current = {
      x,
      y,
      angle,
      fov: Math.PI / 2,
    };
  }, []);

  // Update player state based on keys and mouse
  const updatePlayer = useCallback((deltaTime: number) => {
    // Capture and reset mouse rotation
    const mouseRotation = mouseRotationRef.current;
    mouseRotationRef.current = 0;

    playerRef.current = calculatePlayerMovement(
      playerRef.current,
      keyState.current,
      mouseRotation,
      deltaTime,
      {
        moveSpeed: moveSpeedRef.current,
        canMove: canMoveRef.current,
      }
    );
  }, []);

  return { playerRef, resetPlayer, enableMouseLook, updatePlayer };
}
