import { useEffect, useRef, useCallback } from 'react';

interface UsePlayerMouseInputOptions {
  sensitivity?: number;
}

/**
 * Hook to manage mouse input for player rotation
 * Handles pointer lock and mouse movement
 */
export function usePlayerMouseInput(options: UsePlayerMouseInputOptions = {}) {
  const { sensitivity = 0.0005 } = options;

  const mouseRotationRef = useRef(0); // Accumulated mouse rotation
  const isPointerLockedRef = useRef(false);

  // Mouse movement handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Check if pointer is locked
      if (document.pointerLockElement === null) {
        return;
      }

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
  }, [sensitivity]);

  // Function to enable pointer lock
  const enableMouseLook = useCallback((element: HTMLElement) => {
    element.requestPointerLock();
  }, []);

  return {
    mouseRotationRef,
    isPointerLockedRef,
    enableMouseLook,
  };
}
