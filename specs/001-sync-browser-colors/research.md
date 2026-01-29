# Research: Sync Browser Theme and Background

## Decision: GPU-Accelerated Opacity Layer for Scroll Background
**Rationale**: Updating `background-color` or `background-image` directly on the `body` during a scroll event triggers heavy style recalculations and repaints. By using a separate `fixed` div with `will-change: opacity` and `pointer-events: none`, we can leverage the compositor for smoother transitions.
**Alternatives considered**: 
- Updating CSS variables: Slightly higher overhead as it affects all inherited elements.
- Intersection Observer: Good for discrete changes, but less smooth for continuous "fade relative to depth" requirements.

## Decision: Dynamic Meta Theme-Color Update
**Rationale**: We will use a standard `useEffect` in `App.jsx` (or a dedicated hook) that reads the computed value of `--accent-primary` and updates the `<meta name="theme-color">` element in the document head. This ensures the browser UI stays synced with the theme toggle.
**Alternatives considered**: 
- Static meta tags: Cannot handle dynamic theme switching without page reloads.

## Decision: Scroll Detection with `requestAnimationFrame`
**Rationale**: To achieve p95 interaction latency ≤100ms and avoid jitter, the vertical scroll offset will be captured in a scroll listener but the DOM update (opacity change) will be scheduled via `requestAnimationFrame`.
**Alternatives considered**: 
- Throttled `lodash.throttle`: Effective, but `requestAnimationFrame` is more native to the browser's render cycle for visual updates.

## Decision: Color "Source of Truth"
**Rationale**: The `--accent-primary` variable defined in `index.css` will be the single source of truth. We will use `window.getComputedStyle(document.documentElement).getPropertyValue('--accent-primary')` to fetch the exact hex code for the meta tag.
**Alternatives considered**: 
- Hardcoding colors in JS: Increases maintenance burden and risk of drift between CSS and JS.
