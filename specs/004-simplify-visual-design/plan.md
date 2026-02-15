# Implementation Plan: Simplify Visual Design

**Branch**: `004-simplify-visual-design` | **Date**: 2026-02-15 | **Spec**: [spec.md](file:///Users/pyaethuaung/go/src/github.com/pyaethu-aung/uuid-generator/specs/004-simplify-visual-design/spec.md)  
**Input**: Feature specification from `/specs/004-simplify-visual-design/spec.md`

## Summary

Strip all decorative background elements (gradients, grid overlay, animated blobs, scroll-progress layer), disable scroll-based browser theme-color interpolation, simplify glassmorphism surface tokens to opaque/near-opaque, and replace the CTA gradient with a solid accent color. The approach is purely subtractive — delete unused hooks, components, CSS, and utilities — with design-token updates for surfaces and CTA.

## Technical Context

**Language/Version**: JavaScript (ES2022+), JSX  
**Primary Dependencies**: React 18, Vite, Tailwind CSS  
**Storage**: N/A  
**Testing**: Vitest + @testing-library/react (final coverage: 89.96% stmts / 91.3% lines)  
**Target Platform**: Web — desktop and mobile browsers (Chrome, Safari, Firefox, Edge)  
**Project Type**: Web (single SPA)  
**Performance Goals**: p95 interaction latency ≤100ms; p75 TTI <2s  
**Constraints**: Coverage must remain ≥85%; zero lint/build errors  
**Scale/Scope**: ~15 files affected (modify 6, delete 4, remove ~200 LOC)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Code Quality & Craftsmanship**: ✅ All deleted code (hooks, component, CSS rules, utility) becomes dead code after the changes. Removing them satisfies the "no dead code" principle. No commented-out blocks will remain.
- **II. Testing & Execution Discipline**: ✅ Tests for deleted hooks (`useBrowserThemeSync.test.js`, `useScrollOpacity.test.js`) will be removed alongside the code. `App.test.jsx` does not assert on blob elements or scroll-progress — no updates needed. Coverage will remain ≥85% since both code and tests are removed proportionally. `npm run test`, `npm run lint`, `npm run build` will be validated after each task.
- **III. UX Consistency**: ✅ No keyboard shortcuts, focus order, or responsive layout changes. Only visual surface simplification. The ShortcutReference overlay `backdrop-blur-sm` is retained (it's a modal overlay, not a decorative background).
- **IV. Performance Requirements**: ✅ Removing blob animations (GPU-composited), grid overlay (body::before pseudo-element), and scroll event listeners reduces paint/composite cost. TTI should improve.
- **V. Architecture & Structure**: ✅ Deleted files are in `src/hooks`, `src/components`, `src/utils`. No new files created. Remaining files stay in their correct directories.
- **VI. Execution Discipline**: ✅ `npm run test`, `npm run lint`, `npm run build` will run after each task. Commits follow 50/72 rule.
- **VII. Cross-Platform & Browser Compatibility**: ✅ Solid backgrounds render consistently across all browsers. Static `theme-color` meta tag is universally supported. Visual verification on both desktop and mobile via browser DevTools.
- **VIII. Theme Support Planning**: ✅ All colors remain CSS custom properties. Simplified surface tokens are still design tokens — no hard-coded values.
- **IX. Skill-Driven Development**: ✅ The `.agent/skills/web-design-guidelines/SKILL.md` will be referenced for accessibility contrast ratios when updating surface tokens. React patterns (`.agent/skills/vercel-react-best-practices/SKILL.md`) will guide the simplified `useBrowserThemeSync` hook refactor.

## Project Structure

### Documentation (this feature)

```text
specs/004-simplify-visual-design/
├── plan.md
├── research.md
├── spec.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (files affected)

```text
src/
├── index.css                    # MODIFY: remove --page-gradient, --grid-color,
│                                #   --blob-*-color, --gradient-cta tokens;
│                                #   update surface tokens; remove body::before grid
├── App.css                      # MODIFY: remove .gradient-blob*, @keyframes blob-drift,
│                                #   .scroll-background-layer; update .theme-cta;
│                                #   remove .theme-glass
├── App.jsx                      # MODIFY: removed blob divs, ScrollProgressBackground,
│                                #   useScrollOpacity import/call, simplified
│                                #   useBrowserThemeSync call, remove backdrop-blur
├── hooks/
│   ├── useBrowserThemeSync.js   # MODIFY: remove scroll-based interpolation,
│   │                            #   set static theme-color from --page-bg only
│   ├── useBrowserThemeSync.test.js  # MODIFY: update tests for static behavior
│   ├── useScrollOpacity.js      # DELETE
│   └── useScrollOpacity.test.js # DELETE
├── components/
│   ├── ScrollProgressBackground.jsx  # DELETE
│   ├── ControlPanel.jsx         # MODIFY: removed backdrop-blur from aside
│   └── UuidList.jsx             # MODIFY: aligned Copy button to design tokens
└── utils/
    └── colors.js                # DELETE (sole consumer removed)
```

**Structure Decision**: Existing Vite + React SPA structure. No structural changes — only targeted file modifications and deletions.

## Implementation Tasks

### Task 1: Strip CSS design tokens and background decorations

**Files**: `src/index.css`

**Changes**:
1. Remove `--page-gradient` token from both `:root` and `:root[data-theme="light"]`
2. Remove `--grid-color` token from both themes
3. Remove `--blob-one-color` and `--blob-two-color` tokens from both themes
4. Remove `--gradient-cta` token from both themes; replace `.theme-cta` usage with a solid `background-color` using `--accent-primary`
5. Update `--surface-card`, `--surface-panel`, `--surface-glass`, `--surface-soft` to opaque or near-opaque values
6. Remove `background-image: var(--page-gradient)` from `body`
7. Remove the entire `body::before` rule (grid pattern)

---

### Task 2: Strip App.css decorative styles

**Files**: `src/App.css`

**Changes**:
1. Remove `.gradient-blob`, `.gradient-blob-one`, `.gradient-blob-two` rules
2. Remove `@keyframes blob-drift` animation
3. Remove `.scroll-background-layer` rule
4. Update `.theme-cta` to use `background-color: var(--accent-primary)` instead of `background-image: var(--gradient-cta)`
5. Remove `.theme-glass` class (if no longer meaningful after surface simplification)

---

### Task 3: Simplify App.jsx and remove scroll/blob elements

**Files**: `src/App.jsx`

**Changes**:
1. Remove `import useScrollOpacity` and its invocation
2. Remove `import ScrollProgressBackground` and its JSX element
3. Remove the two `.gradient-blob` `<div>` elements
4. Simplify `useBrowserThemeSync(theme, scrollOpacity)` → `useBrowserThemeSync(theme)` (no opacity param)
5. Remove `backdrop-blur` from the card `<article>` className

---

### Task 4: Refactor useBrowserThemeSync to static mode

**Files**: `src/hooks/useBrowserThemeSync.js`, `src/hooks/useBrowserThemeSync.test.js`

**Changes**:
1. Remove the `opacity` parameter and all `interpolateColor` logic
2. Set `theme-color` meta tag directly to `--page-bg` value
3. Remove `import { interpolateColor }` from `../utils/colors`
4. Remove `document.documentElement.style.backgroundColor` assignment (let CSS handle it)
5. Update tests: remove interpolation test case, keep static theme-color test

---

### Task 5: Delete unused files

**Files to delete**:
- `src/hooks/useScrollOpacity.js`
- `src/hooks/useScrollOpacity.test.js`
- `src/components/ScrollProgressBackground.jsx`
- `src/utils/colors.js`

---

### Task 6: Update ControlPanel.jsx

**Files**: `src/components/ControlPanel.jsx`

**Changes**:
1. Remove `backdrop-blur` from the `<aside>` element className (if present)

---

### Task 8: Align Copy button with CTA design tokens

**Files**: `src/components/UuidList.jsx`

**Changes**:
1. Replace hardcoded `bg-teal-400/90`, `text-slate-950`, `bg-emerald-300` with `--accent-primary`, `--accent-secondary`, `--text-contrast` design tokens
2. Align hover behavior with CTA (opacity-based rather than color-based)

---

### Task 7: Validation

Run the full validation suite:
1. `npm run lint` — zero errors
2. `npm run test` — all tests pass
3. `npm run build` — clean production build
4. Manual visual check in browser (dev server)

## Complexity Tracking

> No Constitution Check violations detected. All gates pass.
> **Implementation complete** — 23 tasks + 1 post-implementation alignment task.

## Design Token Changes

### Tokens Removed

| Token | Themes |
|-------|--------|
| `--page-gradient` | dark, light |
| `--grid-color` | dark, light |
| `--blob-one-color` | dark, light |
| `--blob-two-color` | dark, light |
| `--gradient-cta` | dark, light |

### Tokens Updated (surface simplification)

| Token | Dark (before → after) | Light (before → after) |
|-------|-----------------------|------------------------|
| `--surface-card` | `rgba(255,255,255,0.06)` → `rgba(255,255,255,0.08)` | `rgba(255,255,255,0.95)` → `#ffffff` |
| `--surface-panel` | `rgba(2,6,23,0.78)` → `rgba(2,6,23,0.95)` | `rgba(255,255,255,0.98)` → `#ffffff` |
| `--surface-glass` | `rgba(148,163,184,0.08)` → `rgba(148,163,184,0.12)` | `rgba(226,232,240,0.7)` → `rgba(226,232,240,0.92)` |
| `--surface-soft` | `rgba(15,23,42,0.58)` → `rgba(15,23,42,0.85)` | `rgba(226,232,240,0.85)` → `rgba(226,232,240,0.95)` |

### CTA Token Replacement

| Token | Dark (before → after) | Light (before → after) |
|-------|-----------------------|------------------------|
| `--gradient-cta` (removed) | `linear-gradient(...)` → N/A | `linear-gradient(...)` → N/A |
| `.theme-cta` styling | `background-image: gradient` → `background-color: var(--accent-primary)` | same |

## Verification Plan

### Automated Tests

1. **Run existing test suite**:
   ```bash
   npm run test
   ```
   Expected: all tests pass, zero failures.

2. **Check test coverage**:
   ```bash
   npx vitest run --coverage
   ```
   Expected: statement coverage ≥85%.

3. **Run linter**:
   ```bash
   npm run lint
   ```
   Expected: zero errors, zero warnings.

4. **Run production build**:
   ```bash
   npm run build
   ```
   Expected: clean build, no errors.

### Browser Verification

5. **Visual check** (via `npm run dev` and browser):
   - Dark mode: solid `#030712` background, no grid, no blobs, no gradient on CTA button
   - Light mode: solid `#f8fafc` background, no grid, no blobs, no gradient on CTA button
   - Scroll: no background color transition, no scroll-progress bar
   - Cards and panels: opaque/near-opaque surfaces, readable text
   - Mobile viewport: theme-color matches static `--page-bg`

6. **Grep for dead references**:
   ```bash
   grep -r "interpolateColor\|useScrollOpacity\|ScrollProgressBackground\|gradient-blob\|page-gradient\|grid-color\|blob-one\|blob-two\|gradient-cta" src/
   ```
   Expected: zero matches.
