import { useEffect, useRef, useState, useCallback } from 'react';
import type { Player } from '../utils/raycaster';

interface Use3DPlayerOptions {
  initialX: number;
  initialY: number;
  initialAngle?: number;
  moveSpeed?: number;
  rotateSpeed?: number;
  canMove?: (x: number, y: number) => boolean;
}

interface KeyState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  rotateLeft: boolean;
  rotateRight: boolean;
}

export function use3DPlayer(options: Use3DPlayerOptions) {
  const { initialX, initialY, initialAngle = 0, moveSpeed = 5, rotateSpeed = 10, canMove = () => true } = options;

  const [player, setPlayer] = useState<Player>({
    x: initialX,
    y: initialY,
    angle: initialAngle,
    fov: Math.PI / 2, // 90 degrees
  });

  const keyState = useRef<KeyState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    rotateLeft: false,
    rotateRight: false,
  });

  const animationFrameRef = useRef<number | null>(null);
  const canMoveRef = useRef(canMove);
  const moveSpeedRef = useRef(moveSpeed);
  const rotateSpeedRef = useRef(rotateSpeed);
  const mouseRotationRef = useRef(0); // Accumulated mouse rotation
  const isPointerLockedRef = useRef(false);

  // Keep refs up to date
  useEffect(() => {
    canMoveRef.current = canMove;
    moveSpeedRef.current = moveSpeed;
    rotateSpeedRef.current = rotateSpeed;
  }, [canMove, moveSpeed, rotateSpeed]);

  // Reset player position
  const resetPlayer = useCallback((x: number, y: number, angle: number = 0) => {
    setPlayer({
      x,
      y,
      angle,
      fov: Math.PI / 2,
    });
  }, []);

  // Update player state based on keys and mouse
  const updatePlayer = useCallback((deltaTime: number) => {
    // Capture and reset mouse rotation BEFORE setPlayer
    const mouseRotation = mouseRotationRef.current;
    mouseRotationRef.current = 0;

    setPlayer((prev) => {
      let newX = prev.x;
      let newY = prev.y;
      let newAngle = prev.angle;

      // Mouse rotation - apply captured value
      if (mouseRotation !== 0) {
        newAngle += mouseRotation;
      }

      // Normalize angle
      while (newAngle < 0) newAngle += Math.PI * 2;
      while (newAngle >= Math.PI * 2) newAngle -= Math.PI * 2;

      // Movement
      const dirX = Math.cos(newAngle);
      const dirY = Math.sin(newAngle);

      // Forward/backward movement
      if (keyState.current.forward) {
        const testX = newX + dirX * moveSpeedRef.current * deltaTime;
        const testY = newY + dirY * moveSpeedRef.current * deltaTime;
        if (canMoveRef.current(testX, testY)) {
          newX = testX;
          newY = testY;
        }
      }
      if (keyState.current.backward) {
        const testX = newX - dirX * moveSpeedRef.current * deltaTime;
        const testY = newY - dirY * moveSpeedRef.current * deltaTime;
        if (canMoveRef.current(testX, testY)) {
          newX = testX;
          newY = testY;
        }
      }

      // Strafe left/right
      if (keyState.current.left) {
        const strafeX = dirY;
        const strafeY = -dirX;
        const testX = newX + strafeX * moveSpeedRef.current * deltaTime;
        const testY = newY + strafeY * moveSpeedRef.current * deltaTime;
        if (canMoveRef.current(testX, testY)) {
          newX = testX;
          newY = testY;
        }
      }
      if (keyState.current.right) {
        const strafeX = -dirY;
        const strafeY = dirX;
        const testX = newX + strafeX * moveSpeedRef.current * deltaTime;
        const testY = newY + strafeY * moveSpeedRef.current * deltaTime;
        if (canMoveRef.current(testX, testY)) {
          newX = testX;
          newY = testY;
        }
      }

      const newState = {
        ...prev,
        x: newX,
        y: newY,
        angle: newAngle,
      };
      return newState;
    });
  }, []);

  // Game loop
  useEffect(() => {
    let isActive = true;
    let localLastFrameTime = performance.now();

    const gameLoop = (currentTime: number) => {
      if (!isActive) return;

      // Calculate delta time in seconds
      const deltaTime = (currentTime - localLastFrameTime) / 1000;
      localLastFrameTime = currentTime;

      updatePlayer(deltaTime);
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      isActive = false;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [updatePlayer]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      switch (key) {
        case 'w':
        case 'z': // AZERTY
        case 'arrowup':
          e.preventDefault();
          keyState.current.forward = true;
          break;
        case 's':
        case 'arrowdown':
          e.preventDefault();
          keyState.current.backward = true;
          break;
        case 'a':
        case 'q': // AZERTY
          keyState.current.left = true;
          break;
        case 'd':
          keyState.current.right = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      switch (key) {
        case 'w':
        case 'z': // AZERTY
        case 'arrowup':
          keyState.current.forward = false;
          break;
        case 's':
        case 'arrowdown':
          keyState.current.backward = false;
          break;
        case 'a':
        case 'q': // AZERTY
          keyState.current.left = false;
          break;
        case 'd':
          keyState.current.right = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);

      // Reset all keys on cleanup
      keyState.current = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        rotateLeft: false,
        rotateRight: false,
      };
    };
  }, []);

  // Mouse movement handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Check if pointer is locked
      if (document.pointerLockElement === null) {
        console.log('Pointer not locked, ignoring mouse movement');
        return;
      }

      // Mouse sensitivity (adjust as needed)
      const sensitivity = 0.0005;
      const deltaX = e.movementX * sensitivity;

      // Accumulate rotation
      mouseRotationRef.current += deltaX;
    };

    const handlePointerLockChange = () => {
      const isLocked = document.pointerLockElement !== null;
      isPointerLockedRef.current = isLocked;
    };

    window.addEventListener('mousemove', handleMouseMove, false);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('pointerlockerror', () => {
      console.error('Pointer lock error');
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove, false);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, []);

  // Function to enable pointer lock
  const enableMouseLook = useCallback((element: HTMLElement) => {
    element.requestPointerLock();
  }, []);

  return { player, resetPlayer, enableMouseLook };
}
