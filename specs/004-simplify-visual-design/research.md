# Research: Simplify Visual Design

**Branch**: `004-simplify-visual-design`  
**Date**: 2026-02-15

## Research Tasks & Findings

### 1. Can `interpolateColor` / `colors.js` be safely deleted?

**Decision**: Yes — delete `src/utils/colors.js` entirely.

**Rationale**: `interpolateColor` is only imported by `src/hooks/useBrowserThemeSync.js`. No other file in `src/` references `colors.js` or `interpolateColor`. There is no corresponding `colors.test.js` file, though `colors.js` has 94.11% statement coverage via the `useBrowserThemeSync.test.js` integration tests. Removing the sole consumer + the utility is safe.

**Alternatives considered**:
- Keep `colors.js` as a general utility → Rejected: YAGNI principle; no current or planned consumers. Constitution mandates no dead code.

### 2. Can `useScrollOpacity` be safely deleted?

**Decision**: Yes — delete `src/hooks/useScrollOpacity.js` and `src/hooks/useScrollOpacity.test.js`.

**Rationale**: Only imported in `src/App.jsx`. The returned `scrollOpacity` value is passed to `useBrowserThemeSync` (which also uses it) and `ScrollProgressBackground`. Both consumers are being removed or simplified.

**Alternatives considered**: None — clear single-consumer removal.

### 3. Can `ScrollProgressBackground` be safely deleted?

**Decision**: Yes — delete `src/components/ScrollProgressBackground.jsx`.

**Rationale**: Only imported and rendered in `src/App.jsx`. It applies a scroll-based opacity overlay, which is the exact behavior being removed.

**Alternatives considered**: None — clear single-consumer removal.

### 4. What surface token values maintain WCAG AA contrast?

**Decision**: Use near-opaque values (≥0.85 alpha) for dark theme surfaces and fully opaque values for light theme surfaces.

**Rationale**: With `--page-bg: #030712` (dark) and opaque card surfaces, text contrast ratios comfortably exceed 4.5:1. Light theme surfaces use `#ffffff`, ensuring maximum contrast against `--text-primary: #0f172a` (contrast ratio ~15.4:1).

**Alternatives considered**:
- Fully opaque dark surfaces → Rejected for dark theme: a slight alpha preserves the ability to perceive layered depth without requiring additional shadow tokens.
- Keep existing semi-transparent values → Rejected: contradicts the spec requirement for "opaque or near-opaque" surfaces.

### 5. What replaces `--gradient-cta` for the CTA button?

**Decision**: Use `background-color: var(--accent-primary)` as a solid fill. Retain `--cta-shadow` for depth.

**Rationale**: `--accent-primary` is already the dominant color stop in the gradient. Using it as a solid fill maintains visual continuity while simplifying the surface. The existing hover effect (opacity 0.95) works naturally with a solid color.

**Alternatives considered**:
- Use a new token `--cta-bg` → Rejected: unnecessary indirection when `--accent-primary` already serves the purpose.
- Remove `--cta-shadow` → Deferred: the shadow aids button affordance and doesn't contradict "no gradients."

### 6. Should `backdrop-blur` be removed from cards/panels?

**Decision**: Remove from cards (`App.jsx`) and panels (`ControlPanel.jsx`). Retain on the `ShortcutReference.jsx` modal overlay.

**Rationale**: `backdrop-blur` on cards was intended to soften the gradient background bleeding through semi-transparent surfaces. With opaque surfaces and a solid background, the blur has no visible effect — it's dead styling. The modal overlay blur in `ShortcutReference.jsx` serves a different purpose (dimming background content) and is retained.

**Alternatives considered**:
- Remove all `backdrop-blur` including modal → Rejected: the modal overlay blur aids focus and is a standard UX pattern, not a decorative background element.

### 7. Impact on test coverage

**Decision**: Coverage will remain ≥85%.

**Rationale**: Current coverage is 88.59% stmts / 90.05% lines. Removing the following proportionally removes both code and tests:
- `useScrollOpacity.js` (100% coverage) + `useScrollOpacity.test.js`
- `useBrowserThemeSync.js` (62.96% coverage) + `useBrowserThemeSync.test.js` (updated, not deleted)
- `colors.js` (94.11% coverage) — no dedicated test file
- `ScrollProgressBackground.jsx` (100% coverage) — no dedicated test file

Net effect: removing low-coverage code (`useBrowserThemeSync.js` at 62.96%) will slightly improve overall percentages. The simplified `useBrowserThemeSync` hook (fewer branches) will have higher coverage from the updated test.

### 8. Should the CTA button match the Copy button's styling?

**Decision**: Yes — update `.theme-cta` to use the Copy button's color values (`rgb(45 212 191 / 0.9)`, `#020617`) and hover behavior (`hover:scale-105`, `hover:bg-teal-300`).

**Rationale**: The Copy button's `bg-teal-400/90` styling provides a bright, high-contrast accent that feels more vibrant than the design-token `--accent-primary` value. Aligning the CTA to this style creates visual consistency across all interactive teal buttons. The Copy button retains its existing hardcoded Tailwind values as the source of truth for the shared style.

**Alternatives considered**:
- Align Copy to CTA tokens → Rejected by user: preferred the Copy button's brighter, more interactive feel.
- Create shared design tokens for both → Deferred: current approach works; tokenization is a future cleanup opportunity.

