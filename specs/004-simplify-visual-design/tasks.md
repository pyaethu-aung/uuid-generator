# Tasks: Simplify Visual Design

**Input**: Design documents from `/specs/004-simplify-visual-design/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅

**Tests**: Update `useBrowserThemeSync.test.js` for new static behavior.
Remove test files for deleted hooks. After each task, run
`npm run test`, `npm run lint`, and `npm run build` before merge.

**Organization**: Tasks grouped by user story to enable independent testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Exact file paths included in descriptions

---

## Phase 1: Setup

**Purpose**: No project initialization needed — existing SPA. This phase captures pre-flight verification.

- [ ] T001 Verify clean baseline: run `npm run test`, `npm run lint`, `npm run build` and confirm all pass on current branch

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Remove shared infrastructure (CSS tokens, decorative rules, dead files) that all user stories depend on

**⚠️ CRITICAL**: Token removals and file deletions must complete before story-level component updates

- [ ] T002 [P] Remove `--page-gradient`, `--grid-color`, `--blob-one-color`, `--blob-two-color`, `--gradient-cta` tokens from `:root` and `:root[data-theme="light"]` in `src/index.css`
- [ ] T003 [P] Remove `body::before` grid-pattern rule and `background-image: var(--page-gradient)` from `body` in `src/index.css`
- [ ] T004 [P] Remove `.gradient-blob`, `.gradient-blob-one`, `.gradient-blob-two`, `@keyframes blob-drift`, and `.scroll-background-layer` rules from `src/App.css`
- [ ] T005 Delete `src/hooks/useScrollOpacity.js`
- [ ] T006 Delete `src/hooks/useScrollOpacity.test.js`
- [ ] T007 Delete `src/components/ScrollProgressBackground.jsx`
- [ ] T008 Delete `src/utils/colors.js`

**Checkpoint**: All dead tokens, rules, and files removed. Remaining code may have broken imports — resolved in story phases.

---

## Phase 3: User Story 1 — Clean, Solid Background (Priority: P1) 🎯 MVP

**Goal**: Background is a single solid color in both themes with no gradient or scroll transitions

**Independent Test**: Load app in dark and light mode. Background must be a uniform `#030712` (dark) or `#f8fafc` (light) — no gradients, no scroll-based transitions.

### Implementation for User Story 1

- [ ] T009 [US1] Remove blob `<div>` elements and `ScrollProgressBackground` JSX from `src/App.jsx`; remove `useScrollOpacity` import and invocation
- [ ] T010 [US1] Simplify `useBrowserThemeSync(theme, scrollOpacity)` call to `useBrowserThemeSync(theme)` in `src/App.jsx`

**Checkpoint**: App renders with solid background, no blobs, no scroll-progress overlay. Build may warn on `useBrowserThemeSync` signature mismatch — resolved in Phase 5.

---

## Phase 4: User Story 2 — No Decorative Background Elements (Priority: P1) 🎯 MVP

**Goal**: Grid pattern and animated gradient blobs are fully absent from the DOM

**Independent Test**: Inspect DOM — no `.gradient-blob` elements, no `body::before` pseudo-element with grid pattern.

### Implementation for User Story 2

> All DOM-level decorative elements were already removed in T003 (grid), T004 (blob CSS), and T009 (blob JSX). This phase validates completeness.

- [ ] T011 [US2] Verify no residual references to `gradient-blob`, `page-gradient`, `grid-color`, `blob-one`, `blob-two` in `src/` by running `grep -r` scan

**Checkpoint**: Zero decorative background elements in DOM or CSS. Stories 1 & 2 deliver the MVP.

---

## Phase 5: User Story 3 — Static Browser Theme Color (Priority: P2)

**Goal**: Browser `theme-color` meta tag reflects `--page-bg` statically; no scroll-based interpolation

**Independent Test**: On mobile browser, scroll up and down — address bar color stays fixed at the theme's `--page-bg`.

### Implementation for User Story 3

- [ ] T012 [US3] Refactor `src/hooks/useBrowserThemeSync.js`: remove `opacity` parameter, remove `interpolateColor` import, set `theme-color` directly to `--page-bg` value
- [ ] T013 [US3] Update `src/hooks/useBrowserThemeSync.test.js`: remove interpolation test cases, add test for static `--page-bg` theme-color assignment

**Checkpoint**: `useBrowserThemeSync` is a static theme-color setter. All tests pass.

---

## Phase 6: User Story 4 — Simplified Surface Treatments (Priority: P2)

**Goal**: Card and panel surfaces are opaque or near-opaque with clear text contrast (WCAG AA 4.5:1)

**Independent Test**: In both themes, inspect card and panel elements — surfaces should appear solid, text clearly readable.

### Implementation for User Story 4

- [ ] T014 [P] [US4] Update `--surface-card`, `--surface-panel`, `--surface-glass`, `--surface-soft` tokens to opaque/near-opaque values in both `:root` and `:root[data-theme="light"]` in `src/index.css`
- [ ] T015 [P] [US4] Remove `backdrop-blur` from the card `<article>` className in `src/App.jsx`
- [ ] T016 [P] [US4] Remove `backdrop-blur` from the `<aside>` className in `src/components/ControlPanel.jsx`

**Checkpoint**: Surfaces are opaque. `backdrop-blur` retained only on `ShortcutReference.jsx` modal overlay.

---

## Phase 7: User Story 5 — Flat CTA Styling (Priority: P2)

**Goal**: CTA button uses solid `--accent-primary` background instead of gradient; shadow retained

**Independent Test**: Inspect the "Generate" button in both themes — solid fill, no multi-color gradient across the surface.

### Implementation for User Story 5

- [ ] T017 [US5] Update `.theme-cta` in `src/App.css`: replace `background-image: var(--gradient-cta)` with `background-color: var(--accent-primary)`

**Checkpoint**: CTA button is flat. All P2 stories complete.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, dead-reference scan, and cleanup

- [ ] T018 Run `npm run test` — all tests pass
- [ ] T019 Run `npm run lint` — zero errors
- [ ] T020 Run `npm run build` — clean build
- [ ] T021 Run `npx vitest run --coverage` — confirm statement coverage ≥85%
- [ ] T022 Run dead-reference grep: `grep -r "interpolateColor\|useScrollOpacity\|ScrollProgressBackground\|gradient-blob\|page-gradient\|grid-color\|blob-one\|blob-two\|gradient-cta" src/` — expect zero matches
- [ ] T023 Visual verification via `npm run dev`: check both themes, scroll behavior, CTA button, surface contrast

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — verify clean baseline
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **US1 (Phase 3)** + **US2 (Phase 4)**: Depend on Phase 2 — deliver MVP together
- **US3 (Phase 5)**: Depends on Phase 3 (App.jsx changes settle the `useBrowserThemeSync` call site)
- **US4 (Phase 6)**: Depends on Phase 2 only — no cross-story deps
- **US5 (Phase 7)**: Depends on Phase 2 only — no cross-story deps
- **Polish (Phase 8)**: Depends on all story phases

### User Story Dependencies

- **US1 (P1)**: After Phase 2 → T009, T010
- **US2 (P1)**: After Phase 2 → T011 (validation only, bulk work in Phase 2)
- **US3 (P2)**: After US1 (T010 settles the call site) → T012, T013
- **US4 (P2)**: After Phase 2 → T014, T015, T016 (all parallelizable)
- **US5 (P2)**: After Phase 2 → T017

### Parallel Opportunities

- T002, T003, T004 can all run in parallel (different rules in different files)
- T005–T008 (file deletions) can run in parallel
- T014, T015, T016 can run in parallel (different files, no dependencies)
- US4 and US5 can run in parallel with each other (no cross-deps)

---

## Parallel Example: Phase 2

```bash
# Launch foundational token/rule removals together:
Task: "T002 - Remove deprecated tokens from src/index.css"
Task: "T004 - Remove blob/scroll CSS from src/App.css"

# Launch file deletions together:
Task: "T005 - Delete useScrollOpacity.js"
Task: "T006 - Delete useScrollOpacity.test.js"
Task: "T007 - Delete ScrollProgressBackground.jsx"
Task: "T008 - Delete colors.js"
```

## Parallel Example: User Story 4

```bash
# Launch surface updates together (different files):
Task: "T014 - Update surface tokens in src/index.css"
Task: "T015 - Remove backdrop-blur from App.jsx"
Task: "T016 - Remove backdrop-blur from ControlPanel.jsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup verification
2. Complete Phase 2: Foundational removals
3. Complete Phase 3: US1 — Solid background
4. Complete Phase 4: US2 — No decorative elements
5. **STOP and VALIDATE**: Solid background, zero decorative elements
6. Run `npm run test`, `npm run lint`, `npm run build`

### Incremental Delivery

1. Setup + Foundational → Dead code purged
2. US1 + US2 → MVP: minimalist background ✅
3. US3 → Static browser theme-color ✅
4. US4 → Opaque surfaces ✅
5. US5 → Flat CTA ✅
6. Polish → Full validation and coverage check ✅

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently testable at its checkpoint
- Commit after each phase with a 50/72-compliant message
- Total tasks: 23 (1 setup, 7 foundational, 2 US1, 1 US2, 2 US3, 3 US4, 1 US5, 6 polish)
