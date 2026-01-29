<!--
Sync Impact Report
- Version change: None → 1.0.0
- Modified principles: template placeholders → Code Quality First, Test Discipline & Coverage, UX Consistency & Accessibility, Performance & Responsiveness, Workflow Guardrails
- Added sections: Quality Gates & Standards, Development Workflow & Compliance
- Removed sections: none
- Templates requiring updates: 
	- .specify/templates/plan-template.md ✅
	- .specify/templates/spec-template.md ✅
	- .specify/templates/tasks-template.md ✅
- Follow-up TODOs: none
-->

# UUID Generator Constitution

## Core Principles

### Code Quality First (Non-Negotiable)
Code must be clear, small, and maintainable. Linting and prop validation
requirements apply to all React components. Keep components focused, avoid
duplication, and favor readability over cleverness. Any change that reduces
clarity or introduces inconsistent styling must be refactored before merge.

### Test Discipline & Coverage
Unit tests precede or accompany every change. Vitest is the standard harness.
Global unit test coverage MUST remain at or above 85% and may not regress.
Failing or flaky tests block merges. Add focused unit cases for edge
conditions and regression fixes.

### UX Consistency & Accessibility
Interactions must align with the established control patterns, keyboard
shortcuts, and Tailwind styling documented in the app. All UI changes must
preserve accessible semantics (labels, focus order, ARIA where needed), remain
responsive, and avoid visual regressions across breakpoints.

### Performance & Responsiveness
UI interactions (e.g., slider moves, copy/download actions) should complete in
p95 ≤100ms on target devices. Initial load should remain lightweight (p75
Time-to-Interactive under 2s on a modern laptop). Avoid expensive rerenders;
prefer memoization and event throttling to keep interactions smooth.

### Workflow Guardrails
After every change, run `npm run dev` to execute linting and unit checks; if
`npm run dev` does not execute lint + tests, adjust the script or run the
equivalent commands before merge. Commit after each task with a title ≤50
characters and body lines ≤72 characters. Do not merge without proof of the
latest checks.

## Quality Gates & Standards

- Lint + unit test gate: run `npm run dev` (or its lint+test equivalent) after
	each change; merges require a clean run.
- Coverage gate: Vitest coverage MUST stay ≥85% overall; new code includes unit
	tests that protect new behaviors and edge cases.
- UX gate: preserve documented keyboard shortcuts, focus states, responsive
	layouts, and avoid layout shifts when updating components.
- Performance gate: p95 interaction latency ≤100ms for control changes; avoid
	unnecessary renders and keep bundle additions minimal.

## Development Workflow & Compliance

- Every task produces a commit; messages follow ≤50 char titles and ≤72 char
	bodies.
- Code reviews verify: lint+tests run (`npm run dev` or equivalent), coverage
	impact, UX consistency, and performance implications.
- Feature plans and specs must declare how they satisfy quality, testing, UX,
	performance, and workflow gates. Violations require explicit justification
	and risk acceptance.

## Governance

This constitution governs all delivery practices for UUID Generator. Any
conflicting guideline is superseded by this document. Amendments require a
documented change proposal, updated version number, and a migration/rollout
plan when behavior changes. Semantic versioning applies: MAJOR for breaking
governance changes or principle removals; MINOR for new principles or expanded
guidance; PATCH for clarifications. Compliance is verified during planning,
code review, and before merge by checking gates, coverage, and commit/log
evidence of `npm run dev` (or equivalent) runs.

**Version**: 1.0.0 | **Ratified**: 2026-01-19 | **Last Amended**: 2026-01-19
