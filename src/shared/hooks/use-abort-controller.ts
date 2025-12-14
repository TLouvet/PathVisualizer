import { useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook to manage AbortController lifecycle with automatic cleanup.
 *
 * Automatically aborts the controller when:
 * - Dependencies change
 * - Component unmounts
 *
 * @param dependencies - Array of dependencies that trigger abort when changed
 * @returns Object containing signal, abort function, and createController function
 */
export function useAbortController(dependencies: unknown[] = []) {
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create new controller and abort the previous one
  const createController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    return abortControllerRef.current;
  }, []);

  // Abort on dependencies change
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  // Abort on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    signal: abortControllerRef.current?.signal,
    abort: () => abortControllerRef.current?.abort(),
    createController,
  };
}
