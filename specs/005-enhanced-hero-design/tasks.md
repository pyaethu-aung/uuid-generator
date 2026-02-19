---
description: "Task list for Enhanced Hero Section Design implementation"
---

# Tasks: Enhanced Hero Section Design

**Input**: Design documents from `specs/005-enhanced-hero-design/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Include unit test tasks for every story to keep global coverage ≥85%.
Tests are mandatory for new or changed behavior. After each task, run
`npm run test`, `npm run lint`, and `npm run build` before merge.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create documentation folder `specs/005-enhanced-hero-design/` and ensure assets exist in `specs/005-enhanced-hero-design/assets`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Allow full-bleed layout by refactoring `src/App.jsx` layout structure
- [x] T003 [P] Define new theme variables for subtle gradients/patterns in `src/App.css`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View High-Impact Hero Section (Priority: P1)

**Goal**: As a visitor, I want to see a modern, professionally designed hero section immediately.

**Independent Test**: Load landing page, verify Hero matches design (Badge, Typography, CTAs, Background).

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T004 [P] [US1] Create unit test for Hero content and structure in `src/components/Hero.test.jsx`

### Implementation for User Story 1

- [ ] T005 [US1] Implement new Hero structure (Badge, H1, Subhead) in `src/components/Hero.jsx`
- [ ] T006 [US1] Implement CTA buttons (Primary & External Secondary) in `src/components/Hero.jsx`
- [ ] T007 [US1] Implement CSS/SVG background patterns in `src/components/Hero.jsx` (or via CSS classes)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Seamless Theme Switching (Priority: P1)

**Goal**: As a user, I want the hero section to look consistent and beautiful in my preferred theme.

**Independent Test**: Toggle Light/Dark mode, observe Hero background and text contrast changes.

### Tests for User Story 2 ⚠️

- [ ] T008 [P] [US2] Update unit tests to verify theme-specific class presence in `src/components/Hero.test.jsx`

### Implementation for User Story 2

- [ ] T009 [US2] Verify and adjust Light mode specific styles for Hero in `src/App.css` / `Hero.jsx`
- [ ] T010 [US2] Verify and adjust Dark mode specific styles for Hero in `src/App.css` / `Hero.jsx`
- [ ] T011 [US2] Ensure smooth transition properties apply to new Hero elements in `src/App.css`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T012 [P] Verify responsiveness on mobile (stacking) vs desktop in `src/components/Hero.jsx`
- [ ] T013 Run full lint check `npm run lint` and fix any new style issues
- [ ] T014 Verify `npm run build` passes with new components
- [ ] T015 Update specific documentation if needed in `docs/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Integrated with US1 components

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Structure before styles
- Story complete before moving to next priority

### Parallel Opportunities

- T004 (Tests US1) and T008 (Tests US2) can be written in parallel
- Once T002 (Layout) is done, visual work in T005/T006 and theme work in T009/T010 can partly overlap

---

## Implementation Strategy

### Incremental Delivery

1. Complete Setup + Foundational (Layout refactor)
2. Add User Story 1 (Hero Content) → Test independently
3. Add User Story 2 (Theming) → Test independently
4. Polish & Final Verify
