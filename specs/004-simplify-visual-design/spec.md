# Feature Specification: Simplify Visual Design

**Feature Branch**: `004-simplify-visual-design`  
**Created**: 2026-02-15  
**Status**: Implemented  
**Input**: User description: "Simplify the visual design of the application by removing decorative background elements and dynamic browser integration behaviors. The goal is to create a minimalist, high-contrast interface for both light and dark themes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Clean, Solid Background (Priority: P1)

As a user, I want the application to have a single, solid background color instead of layered gradients so the interface feels clean and distraction-free.

**Why this priority**: The background is the most visible surface of the entire application. Replacing the multi-layer gradient with a flat, solid color is the highest-impact change for achieving a minimalist look and improving visual clarity.

**Independent Test**: Open the application in both light and dark modes and confirm the background is a single, solid color with no gradient transitions or color blending.

**Acceptance Scenarios**:

1. **Given** the application is loaded in dark mode, **When** the page renders, **Then** the background MUST be a single solid color (`#030712`) with no gradient overlay.
2. **Given** the application is loaded in light mode, **When** the page renders, **Then** the background MUST be a single solid color (`#f8fafc`) with no gradient overlay.
3. **Given** either theme is active, **When** the user scrolls, **Then** the background color MUST remain constant — no scroll-based color transitions occur.

---

### User Story 2 - No Decorative Background Elements (Priority: P1)

As a user, I want the background grid pattern and floating gradient blobs to be removed so the canvas is uncluttered and content is the sole focus.

**Why this priority**: The grid pattern and floating blobs are the primary decorative elements that compete with content for attention. Removing them is essential for the minimalist vision.

**Independent Test**: Inspect the application in both themes and confirm there is no faint grid pattern and no blurred, animated gradient blobs behind the content.

**Acceptance Scenarios**:

1. **Given** any theme is active, **When** the page renders, **Then** no background grid pattern is visible.
2. **Given** any theme is active, **When** the page renders, **Then** no animated gradient blobs are present in the DOM or are rendered offscreen.

---

### User Story 3 - Static Browser Theme Color (Priority: P2)

As a mobile user, I want the browser status bar / address bar to match my current theme color without dynamically changing as I scroll, so the experience is consistent and non-distracting.

**Why this priority**: The scroll-based color interpolation in the browser chrome is a secondary visual behavior. Removing it reduces complexity and prevents the address bar color from shifting unexpectedly during scroll.

**Independent Test**: Open the application on a mobile browser, scroll up and down, and confirm the address bar color stays fixed and does not transition through intermediate colors.

**Acceptance Scenarios**:

1. **Given** the application is loaded in dark mode on a mobile browser, **When** the user scrolls, **Then** the browser theme-color MUST remain the fixed page background color (`#030712`).
2. **Given** the user toggles from dark to light mode, **When** the theme changes, **Then** the browser theme-color MUST update to the new fixed page background color (`#f8fafc`) — without scroll-based interpolation.

---

### User Story 4 - Simplified Surface Treatments (Priority: P2)

As a user, I want card and panel surfaces to feel solid and readable rather than using heavy glassmorphism or transparency layers.

**Why this priority**: Complex transparency layers (glass, soft, semi-opaque panels) can reduce text contrast and add visual noise. Simplifying surface tokens improves readability, especially for accessibility.

**Independent Test**: Inspect cards and panels in both themes. Surfaces should appear opaque or near-opaque with clear, high-contrast text.

**Acceptance Scenarios**:

1. **Given** the dark theme is active, **When** a card or panel is rendered, **Then** the surface background MUST be opaque or very close to opaque — no heavy transparency or blurred glass effects.
2. **Given** the light theme is active, **When** a card or panel is rendered, **Then** the surface background MUST be opaque or nearly opaque.

---

### User Story 5 - Flat CTA and Interactive Element Styling (Priority: P2)

As a user, I want call-to-action buttons and interactive UI elements to use solid accent colors instead of gradient fills so the interface feels consistent with the overall minimalist design.

**Why this priority**: The CTA button gradient is the most prominent remaining gradient in the UI after background simplification. Replacing it with a solid color completes the minimalist visual language.

**Independent Test**: Inspect the primary "Generate" button and the "Copy" button on each UUID row. Both should display the same solid teal accent color background — no color transitions across the surface.

**Acceptance Scenarios**:

1. **Given** the dark theme is active, **When** the Generate button renders, **Then** its background MUST be a solid accent color — not a multi-stop gradient.
2. **Given** the light theme is active, **When** the Generate button renders, **Then** its background MUST be a solid accent color.
3. **Given** either theme is active, **When** the user hovers over the CTA button, **Then** the hover state must remain a solid color variation (e.g., slight opacity or shade shift) — not a gradient.
4. **Given** either theme is active, **When** the CTA and Copy buttons render, **Then** both MUST display the same teal background color and dark text color.

---

### Edge Cases

- What happens when the user's OS prefers reduced motion? — The removal of animated blobs and scroll transitions inherently satisfies `prefers-reduced-motion`; no additional handling is needed beyond what this feature achieves.
- How does this affect the existing theme toggle animation? — Theme toggle transitions (200ms ease on background-color and color) remain unaffected; only the decorative elements and scroll-based behaviors are removed.
- What if a user has a browser that does not support `theme-color`? — The existing fallback behavior (no meta tag support = no effect) remains unchanged. The simplification only removes the scroll-based interpolation.
- What happens to the `colors.js` utility (`interpolateColor`)? — Deleted. No other consumers existed; confirmed via grep scan during implementation.

## Requirements *(mandatory)*

### Constitution Alignment (Mandatory)

- **I. Code Quality & Craftsmanship**: Remove all dead CSS rules (gradient blobs, grid pattern, scroll-background-layer), unused hooks (`useScrollOpacity`, `useBrowserThemeSync`), and the `ScrollProgressBackground` component. Clean up CSS custom properties that are no longer referenced (e.g., `--page-gradient`, `--grid-color`, `--blob-one-color`, `--blob-two-color`). All removals must leave zero unused code.
- **II. Testing & Execution Discipline**: Remove test files for deleted hooks (`useBrowserThemeSync.test.js`, `useScrollOpacity.test.js`). Update `App.test.jsx` to reflect the absence of gradient blobs and scroll-progress elements. Ensure global test coverage remains ≥85%.
- **III. UX Consistency**: The minimalist design must maintain the same responsive layouts, focus order, and keyboard shortcuts. No functional UI behavior changes — only visual simplification.
- **IV. Performance Requirements**: Removing GPU-composited blob animations and scroll event listeners will reduce paint/composite cost. p95 interaction latency must remain ≤100ms; Time-to-Interactive should improve or remain under 2s.
- **V. Architecture & Structure**: Deleted files must be removed from their respective directories (`src/hooks`, `src/components`). No new files are created.
- **VI. Execution Discipline**: `npm run test`, `npm run lint`, and `npm run build` must all pass after the changes.
- **VII. Cross-Platform & Browser Compatibility**: Verify that the solid backgrounds render correctly across Chrome, Safari, Firefox, and Edge on both desktop and mobile. Verify meta `theme-color` still works in static mode on mobile browsers.
- **VIII. Theme Support Planning**: All colors must continue to use CSS custom properties. The simplified surface tokens must remain defined as design tokens — no hard-coded color values in component styles.
- **IX. Skill-Driven Development**: Reference `.agent/skills/web-design-guidelines/SKILL.md` for accessibility contrast ratios when updating surface tokens.

### Functional Requirements

- **FR-001**: The application MUST use a single solid `background-color` (no `background-image` or gradient) for the page body in both light and dark themes.
- **FR-002**: The application MUST NOT render a CSS grid pattern overlay on the background (the `body::before` pseudo-element grid must be removed).
- **FR-003**: The application MUST NOT render animated gradient blob elements.
- **FR-004**: The application MUST NOT dynamically interpolate the browser `theme-color` meta tag based on scroll position. The theme-color should reflect the static page background color and update only on theme toggle.
- **FR-005**: The application MUST NOT render a scroll-progress background overlay that changes opacity based on scroll position.
- **FR-006**: Card and panel surface tokens MUST be updated to use opaque or near-opaque values, removing heavy glassmorphism transparency.
- **FR-007**: All CSS custom properties, hooks, components, and test files made obsolete by FR-001 through FR-006 MUST be removed to prevent dead code.
- **FR-008**: CTA buttons and interactive UI elements MUST use a solid accent background color instead of a gradient fill. The `--gradient-cta` design token MUST be replaced with a solid color token.
- **FR-009**: The CTA button MUST visually match the Copy button's teal accent color (`bg-teal-400/90`) and hover behavior (`hover:scale-105`, `hover:bg-teal-300`).

### Assumptions

- The existing solid background colors (`--page-bg: #030712` for dark, `--page-bg: #f8fafc` for light) are the intended final background colors.
- The `interpolateColor` utility in `src/utils/colors.js` may be removed if no other features depend on it; this will be evaluated during implementation.
- The `--gradient-cta` token will be replaced with a solid accent color value. The CTA shadow (`--cta-shadow`) will be simplified or retained depending on visual consistency during implementation.
- Shadows (`--shadow-card`, `--shadow-panel`) are retained as they provide depth to content cards without being decorative background elements.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Both light and dark themes render a single, solid background color with zero gradient or image layers visible on the page background.
- **SC-002**: No animated or static decorative elements (blobs, grids) are present in the rendered DOM.
- **SC-003**: The browser `theme-color` remains a fixed value matching `--page-bg` regardless of scroll position.
- **SC-004**: Card and panel surfaces display text with sufficient contrast (WCAG AA minimum 4.5:1 ratio for normal text) in both themes.
- **SC-005**: `npm run test`, `npm run lint`, and `npm run build` pass with zero errors after all changes.
- **SC-006**: Test coverage remains at or above 85%.
- **SC-007**: No scroll event listeners related to background color transitions are registered after the changes.
- **SC-008**: All CTA buttons and interactive elements display solid accent-colored backgrounds with no visible gradient across their surface.
