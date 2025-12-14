import { useEffect, useRef } from 'react';

/**
 * Generic game loop hook that calls an update function on every frame
 * @param onUpdate - Callback function that receives deltaTime in seconds
 */
export function useGameLoop(onUpdate: (deltaTime: number) => void) {
  const animationFrameRef = useRef<number | null>(null);
  const onUpdateRef = useRef(onUpdate);

  // Keep the callback ref up to date
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    let isActive = true;
    let localLastFrameTime = performance.now();

    const gameLoop = (currentTime: number) => {
      if (!isActive) return;

      // Calculate delta time in seconds
      const deltaTime = (currentTime - localLastFrameTime) / 1000;
      localLastFrameTime = currentTime;

      onUpdateRef.current(deltaTime);
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
  }, []); // Empty deps - we use ref to avoid recreating the loop
}
