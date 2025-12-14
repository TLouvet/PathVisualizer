import { useEffect, useRef } from 'react';

export interface PlayerKeyState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

/**
 * Hook to manage keyboard input state for player movement
 * Handles WASD, ZQSD (AZERTY), and arrow keys
 */
export function usePlayerKeyboardInput() {
  const keyState = useRef<PlayerKeyState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

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
      };
    };
  }, []);

  return keyState;
}
