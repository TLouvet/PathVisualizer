import { useCallback } from 'react';

interface ControlItem {
  label: string;
  keys: string;
}

interface UseControlsPanelOptions {
  controls?: ControlItem[];
  position?: {
    x: number;
    y: number;
  };
  backgroundColor?: string;
  textColor?: string;
  font?: string;
}

const DEFAULT_CONTROLS: ControlItem[] = [
  { label: 'Move Forward', keys: 'W/Z/↑' },
  { label: 'Move Backward', keys: 'S/↓' },
  { label: 'Strafe Left', keys: 'Q/A' },
  { label: 'Strafe Right', keys: 'D' },
  { label: 'Carve Wall', keys: 'Click' },
];

const LINE_HEIGHT = 20;
const PADDING = 10;
const TITLE_HEIGHT = 25;
const PANEL_WIDTH = 280;

/**
 * Hook to manage controls panel rendering for the 3D view
 */
export function useControlsPanel(options: UseControlsPanelOptions = {}) {
  const {
    controls = DEFAULT_CONTROLS,
    backgroundColor = 'rgba(0, 0, 0, 0.7)',
    textColor = '#fff',
    font = '14px monospace',
  } = options;

  const drawControlsPanel = useCallback(
    (ctx: CanvasRenderingContext2D, screenHeight: number, x: number = 10) => {
      const panelHeight = TITLE_HEIGHT + controls.length * LINE_HEIGHT + PADDING;

      const y = screenHeight - panelHeight - PADDING;

      // Draw background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(x, y, PANEL_WIDTH, panelHeight);

      // Draw title
      ctx.fillStyle = textColor;
      ctx.font = font;
      ctx.fillText('Controls:', x + PADDING, y + TITLE_HEIGHT);

      // Draw control items
      controls.forEach((control, index) => {
        const itemY = y + TITLE_HEIGHT + (index + 1) * LINE_HEIGHT;
        ctx.fillText(`${control.keys}: ${control.label}`, x + PADDING, itemY);
      });
    },
    [controls, backgroundColor, textColor, font]
  );

  return { drawControlsPanel };
}
