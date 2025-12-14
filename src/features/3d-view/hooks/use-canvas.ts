import { useEffect, useRef } from 'react';

interface UseCanvasOptions {
  /**
   * Whether to automatically resize the canvas to match window dimensions
   * @default true
   */
  autoResize?: boolean;
}

/**
 * Hook to manage a canvas element with automatic resize handling
 */
export function useCanvas(options: UseCanvasOptions = {}) {
  const { autoResize = true } = options;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle canvas resize
  useEffect(() => {
    if (!autoResize) return;

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
  }, [autoResize]);

  return {
    canvasRef,
  };
}
