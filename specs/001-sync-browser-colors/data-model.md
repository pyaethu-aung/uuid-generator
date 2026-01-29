# Data Model: Browser Sync and Scroll States

## UI States

### `themeColor` (Derived)
- **Source**: Computed value of `--accent-primary`.
- **Description**: The hex code used to update the `<meta name="theme-color">`.
- **Lifecycle**: Updates whenever the theme toggle (Dark/Light) is triggered.

### `scrollOpacity` (Calculated)
- **Source**: `window.scrollY`.
- **Description**: A value between `0` and `1`.
- **Calculation Logic**:
  - If `scrollY` < 80: `opacity = 0`
  - If `scrollY` > 500: `opacity = 1`
  - Else: `linearInterpolation(80, 500, scrollY)`
- **Lifecycle**: Updates on every scroll tick (optimized via `requestAnimationFrame`).

## DOM Entities

### `meta[name="theme-color"]`
- **Attributes**: `content` (string, hex color).
- **Target**: Document Head.

### `ScrollProgressBackground` Overlay
- **Attributes**: 
  - `fixed` position
  - `inset-0`
  - `z-index: -1`
  - `background-color: var(--accent-primary)`
  - `opacity: scrollOpacity`
  - `pointer-events: none`
