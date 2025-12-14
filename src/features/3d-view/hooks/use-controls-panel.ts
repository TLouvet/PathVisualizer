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
];

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
      const lineHeight = 20;
      const padding = 10;
      const titleHeight = 25;
      const panelHeight = titleHeight + controls.length * lineHeight + padding;
      const panelWidth = 280;
      const y = screenHeight - panelHeight - padding;

      // Draw background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(x, y, panelWidth, panelHeight);

      // Draw title
      ctx.fillStyle = textColor;
      ctx.font = font;
      ctx.fillText('Controls:', x + padding, y + titleHeight);

      // Draw control items
      controls.forEach((control, index) => {
        const itemY = y + titleHeight + (index + 1) * lineHeight;
        ctx.fillText(`${control.keys}: ${control.label}`, x + padding, itemY);
      });
    },
    [controls, backgroundColor, textColor, font]
  );

  return { drawControlsPanel };
}
