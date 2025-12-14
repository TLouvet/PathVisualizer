import { useState, useEffect } from 'react';

const MOBILE_USER_AGENT_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

/**
 * Detects if the user is on a mobile device.
 * Used to provide touch-optimized interactions and mobile-specific UI adjustments.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return MOBILE_USER_AGENT_REGEX.test(navigator.userAgent);
  });

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(MOBILE_USER_AGENT_REGEX.test(navigator.userAgent));
    };

    checkIsMobile();
  }, []);

  return isMobile;
}
