# Tasks: Sync Browser Theme and Background

**Input**: Design documents from `/specs/001-sync-browser-colors/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Include unit test tasks for every story to keep global coverage ≥85%.
Tests are mandatory for changed behavior and must be runnable via `npm run dev` before merge.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Ensure development environment is clean by running `npm run dev`
- [x] T002 Establish new component structure for scroll effects in `src/components/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure needed for both browser sync and scroll effects

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create `src/hooks/useBrowserThemeSync.js` skeleton with theme detection logic
- [x] T004 Create `src/components/ScrollProgressBackground.jsx` skeleton with GPU-accelerated styling in `src/App.css`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Consistent Brand Experience on Mobile (Priority: P1) 🎯 MVP

**Goal**: Synchronize the browser's interface color (meta theme-color) with the application's `--accent-primary` color.

**Independent Test**: Verify that the `<meta name="theme-color">` tag in the head updates correctly when the theme is toggled.

### Tests for User Story 1
- [ ] T005 [P] [US1] Create unit test in `src/hooks/useBrowserThemeSync.test.js` to verify meta tag updates on theme toggle
- [ ] T006 [P] [US1] Ensure `src/hooks/useBrowserThemeSync.test.js` fails as expected before implementation

### Implementation for User Story 1
- [ ] T007 [US1] Implement `useBrowserThemeSync` hook in `src/hooks/useBrowserThemeSync.js` using `getComputedStyle`
- [ ] T008 [US1] Integrate `useBrowserThemeSync` into `src/App.jsx`
- [ ] T009 [US1] Verify functional and unit test pass for Story 1

**Checkpoint**: User Story 1 (Browser Sync) is fully functional and testable independently.

---

## Phase 4: User Story 2 - Dynamic Scroll Background (Priority: P2)

**Goal**: Implement a linear gradient background fade (0 to 1 opacity) from 80px to 500px scroll depth using the primary brand color.

**Independent Test**: Scroll past 80px and watch the background layer appear, reaching full opacity at 500px.

### Tests for User Story 2
- [ ] T010 [P] [US2] Create unit test in `src/components/ScrollProgressBackground.test.jsx` for opacity calculation logic
- [ ] T011 [P] [US2] Ensure `src/components/ScrollProgressBackground.test.jsx` fails before implementation

### Implementation for User Story 2
- [ ] T012 [P] [US2] Add `.scroll-background-layer` and associated GPU optimizations to `src/App.css`
- [ ] T013 [US2] Implement `ScrollProgressBackground` component in `src/components/ScrollProgressBackground.jsx` using `requestAnimationFrame`
- [ ] T014 [US2] Integrate `ScrollProgressBackground` as a fixed overlay in `src/App.jsx`
- [ ] T015 [US2] Verify functional and unit test pass for Story 2

**Checkpoint**: User Story 2 (Scroll Background) is fully functional and testable independently.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T016 [P] Verify performance p95 interaction latency ≤100ms during transition via Chrome DevTools
- [ ] T017 Run final validation according to `quickstart.md`
- [ ] T018 Delete temporary test markers and run final `npm run dev` check

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS US1 & US2.
- **User Stories (Phase 3 & 4)**: Depend on Foundational completion. US1 is P1 (MVP), US2 is P2.
- **Polish (Final Phase)**: Depends on all stories being complete.

### User Story Dependencies
- **User Story 1 (P1)**: Independent after Phase 2.
- **User Story 2 (P2)**: Independent after Phase 2.

### Parallel Opportunities
- T005, T006, T010, T011 (Tests) can run in parallel.
- US1 (Phase 3) and US2 (Phase 4) can be developed in parallel once Phase 2 skeleton is ready.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Setup & Foundation.
2. Complete US1: Browser Sync.
3. Validate and demo.

### Incremental Delivery
1. Add US2: Scroll Background after US1 is stable.
2. Perform final cross-cutting performance checks.
