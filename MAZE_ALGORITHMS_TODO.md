# Maze Generation Algorithms - Future Implementations

## Currently Implemented
- ✅ **DFS (Recursive Backtracker)** - Creates long, winding passages with low branching
- ✅ **Prim's Algorithm** - Creates mazes with more branching and shorter dead-ends

---

## To Implement - Multiple Solutions

### 1. Imperfect Maze
**Difficulty:** Easy
**Description:** Remove random walls from a perfect maze to create loops and multiple paths
**Steps:**
1. Generate a perfect maze (using DFS, Prim's, etc.)
2. Randomly remove X% of walls (configurable, e.g., 10-30%)
3. Creates multiple valid solutions

**Visual Result:** Same structure as base algorithm but with shortcuts and loops

---

### 2. Modified Kruskal's Algorithm
**Difficulty:** Medium
**Description:** Use union-find but occasionally connect already-connected regions
**Steps:**
1. Start with all cells as walls
2. Randomly add edges between cells
3. Don't always check if cells are already connected (creates loops)

**Visual Result:** Very uniform maze with natural loops and multiple paths

---

### 3. Cellular Automata (Cave Generation)
**Difficulty:** Medium
**Description:** Creates organic, cave-like structures with many paths
**Algorithm:** 4-5 Rule (or similar)
1. Randomly fill grid with walls/passages (e.g., 45% passages)
2. Apply rules repeatedly:
   - If cell has 5+ wall neighbors → becomes wall
   - If cell has 4- wall neighbors → becomes passage
3. Repeat 4-5 iterations

**Visual Result:** Organic caves with natural-looking passages and multiple routes

---

## To Implement - Mazes with Rooms

### 4. Binary Space Partitioning (BSP)
**Difficulty:** Medium-Hard
**Description:** Recursively divides space into rectangles (rooms), then connects them
**Steps:**
1. Start with full grid rectangle
2. Recursively split into smaller rectangles
3. Create rooms within leaf rectangles
4. Connect rooms with corridors
5. Common in roguelike dungeon generation

**Visual Result:** Rectangular rooms of varying sizes connected by corridors

---

### 5. Room + Maze Hybrid
**Difficulty:** Easy-Medium
**Description:** Pre-place rooms, then fill remaining space with maze
**Steps:**
1. Randomly place rectangular rooms (check for overlaps)
2. Mark room areas as passages
3. Fill remaining grid space with maze algorithm (DFS/Prim's)
4. Ensure rooms connect to maze passages

**Visual Result:** Large open rooms connected by maze-like corridors

**Parameters:**
- Number of rooms (e.g., 3-8)
- Room size range (e.g., 3x3 to 7x7)
- Minimum spacing between rooms

---

### 6. Recursive Division with Room Gaps
**Difficulty:** Medium
**Description:** Recursive division but leaves larger gaps creating chamber-like areas
**Steps:**
1. Start with empty grid (all passages)
2. Recursively divide space with walls
3. Leave gaps in walls (passages)
4. Can leave some divisions without walls (creates rooms)

**Visual Result:** Chambers and rooms connected by passages, more organized than organic caves

---

## Other Interesting Algorithms

### 7. Eller's Algorithm
**Difficulty:** Medium
**Description:** Generates maze row-by-row (memory efficient, good for infinite mazes)

### 8. Aldous-Broder / Wilson's Algorithm
**Difficulty:** Medium
**Description:** Truly unbiased random mazes (but slower)

### 9. Binary Tree / Sidewinder
**Difficulty:** Easy
**Description:** Very fast algorithms with directional bias

---

## Recommended Implementation Order

1. **Imperfect Maze** (Easy win - just modify existing algorithms)
2. **Room + Maze Hybrid** (Good visual variety, not too complex)
3. **Cellular Automata** (Unique organic look)
4. **BSP** (Professional dungeon-style mazes)
5. **Recursive Division** (Different algorithm family)

---

## UI Considerations

When implementing these, consider:
- Add a slider for "imperfection" percentage (for imperfect mazes)
- Add controls for room count/size (for room-based algorithms)
- Group algorithms by type in the selector:
  - **Perfect Mazes** (DFS, Prim's)
  - **Multiple Solutions** (Imperfect, Kruskal's, Cellular Automata)
  - **With Rooms** (BSP, Room+Maze, Recursive Division)
