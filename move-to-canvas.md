# Canvas Migration Plan

## Problem
Current HTML/CSS/React grid rendering is laggy with animations. Each cell is a DOM node, causing performance issues with:
- 35x20 = 700 DOM nodes minimum
- CSS animations on each cell
- React re-renders for state changes
- DOM manipulation overhead

## Solution
Replace DOM-based grid with Canvas rendering while keeping React for state management and UI controls.

## Architecture

### What Stays (React)
- State management (Zustand store)
- UI controls (toolbar, settings)
- Event coordination
- Algorithm logic

### What Changes (Canvas)
- Grid visualization
- Cell rendering
- Animations (via requestAnimationFrame)
- Mouse interaction (hit detection)

## Implementation Steps

### 1. Create CanvasGrid Component
**File**: `src/components/grid/canvas-grid.tsx`

**Responsibilities**:
- Render canvas element
- Subscribe to grid store for node data
- Handle canvas rendering loop
- Implement hit detection for mouse events

**Key Features**:
- `useEffect` with `requestAnimationFrame` for smooth rendering
- Cell size calculation based on canvas dimensions
- Color mapping for different cell states
- Animation state tracking (pulse effects, ripple effects)

### 2. Canvas Rendering Logic

**Cell State Colors**:
- `NONE`: Empty/background color
- `START`: Green with pulse animation
- `END`: Purple with pulse animation
- `WALL`: Black/dark gray
- `VISITED`: Red gradient with ripple effect
- `SOLUTION`: Yellow/gold with flow animation

**Animation System**:
- Track animation timestamps per cell
- Use elapsed time for animation progress
- Continuous render loop (requestAnimationFrame)
- Smooth transitions between states

### 3. Mouse Interaction

**Hit Detection**:
```typescript
// Convert mouse coordinates to grid coordinates
const getGridPosition = (mouseX: number, mouseY: number) => {
  const rect = canvas.getBoundingClientRect();
  const x = mouseX - rect.left;
  const y = mouseY - rect.top;
  const col = Math.floor(x / cellWidth);
  const row = Math.floor(y / cellHeight);
  return { row, col };
};
```

**Event Handlers**:
- `onClick`: Place start/end/wall
- `onMouseMove`: Drag drawing (wall/erase)
- `onMouseDown`: Start drawing
- `onMouseUp`: Stop drawing
- `onMouseLeave`: Stop drawing

### 4. Replace Grid Component

**File**: `src/components/grid/grid.tsx`

**Changes**:
- Remove `GridCell` component mapping
- Replace with `<CanvasGrid />` component
- Keep all event handlers and store subscriptions
- Pass handlers as props to CanvasGrid

### 5. Animation Implementation

**Pulse Animation (Start/End)**:
```typescript
const pulseScale = 1 + Math.sin(timestamp * 0.002) * 0.1;
const glowIntensity = 0.5 + Math.sin(timestamp * 0.002) * 0.5;
```

**Ripple Animation (Visited)**:
```typescript
const elapsed = timestamp - animationStart;
const progress = Math.min(elapsed / 300, 1); // 300ms duration
const radius = cellSize * progress;
```

**Flow Animation (Solution)**:
```typescript
const elapsed = timestamp - animationStart;
const progress = Math.min(elapsed / 400, 1); // 400ms duration
const scale = 0.8 + (progress * 0.4); // Scale from 0.8 to 1.2
```

## Performance Benefits

- **Before**: 700+ DOM nodes, CSS animations, React reconciliation
- **After**: 1 Canvas element, GPU-accelerated rendering, direct pixel manipulation

**Expected Performance**:
- 60 FPS with 10,000+ cells
- Smooth animations even during pathfinding
- Instant grid size changes
- No layout thrashing

## Testing Checklist

- [ ] Canvas renders all cell states correctly
- [ ] Mouse click places start/end/wall
- [ ] Mouse drag draws/erases walls
- [ ] Animations play smoothly (start/end pulse, visited ripple, solution flow)
- [ ] Grid resizing works correctly
- [ ] Pathfinding visualization updates in real-time
- [ ] Performance is significantly better than DOM version
- [ ] No visual artifacts or flickering

## Rollback Plan

If Canvas implementation has issues:
1. Keep both implementations
2. Add feature flag to switch between DOM/Canvas
3. Allow users to choose in settings

## Files to Create/Modify

### Create:
- `src/components/grid/canvas-grid.tsx` - Main canvas component
- `src/hooks/useCanvasRendering.ts` - Canvas rendering logic (optional, can be inline)

### Modify:
- `src/components/grid/grid.tsx` - Replace GridCell mapping with CanvasGrid

### Keep (no changes):
- `src/store/grid-store.ts` - State management stays the same
- `src/types/grid-node.ts` - Types stay the same
- All algorithm and UI components

## Notes

- Canvas uses coordinate system (0,0) at top-left
- Handle high DPI displays with `devicePixelRatio`
- Clean up requestAnimationFrame on unmount
- Consider using OffscreenCanvas for better performance (future optimization)
