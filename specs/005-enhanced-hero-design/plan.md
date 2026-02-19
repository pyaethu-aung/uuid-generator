# Implementation Plan: Enhanced Hero Section Design

**Branch**: `005-enhanced-hero-design` | **Date**: 2026-02-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/005-enhanced-hero-design/spec.md`

## Summary

Enhance the Hero section to improve first impressions and trust. The new design will feature a full-bleed background using CSS/SVG patterns, a "Fresh IDs" badge, impactful typography, and clear calls to action (Secondary: External Docs). The implementation will support seamless light/dark theme switching and align with the "UUID Generator Landing Page" design aesthetic.

## Technical Context

**Language/Version**: JavaScript (React + Vite)
**Primary Dependencies**: React, TailwindCSS, Vanilla CSS (for custom variables)
**Testing**: Vitest (Unit), Manual (Visual/Responsive)
**Target Platform**: Web (Responsive: Mobile to Desktop)
**Performance Goals**: Hero render < 100ms LCP contribution.
**Constraints**: 
- Must use existing styling framework (Vanilla CSS variables + utility classes).
- Must verify full support for Light/Dark modes.
- No new heavy aesthetic dependencies (motion libs, etc.) unless justified.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Code Quality**: Will use existing linting/formatting.
- [x] **II. Testing**: Will add unit tests for `Hero.jsx`.
- [x] **III. UX**: Consistent with existing design system, premium feel.
- [x] **VII. Cross-Platform**: Responsive design (mobile stack vs desktop full-bleed).
- [x] **VIII. Theme Support**: Explicitly planned for Light/Dark modes.
- [x] **IX. Skill-Driven**: Will utilize `react-components` and `web-design-guidelines` skills.

## Phase 0: Research & Unknowns

**Status**: [Resolved]

- **Layout Strategy**: The current `App.jsx` constrains all content within a `max-w-6xl` container. To achieve "Full-Bleed Background" (FR-007), we must restructure `App.jsx` to allow the Hero component to span the full viewport width while its internal content ensures alignment.
- **Visual Assets**: background patterns will be implemented using CSS gradients/SVG to avoid image loads and allow easy theming.
- **Design Source**: Retrieved screenshot from Stitch project `projects/3811513497141801643`.

## Phase 1: Design & Contracts

**Status**: [Skipped - No new Data/API]

- **Data Model**: No changes. Uses existing `ThemePreference`.
- **API**: None.

## Phase 2: React Component Design

### Components

#### `Hero` (Modified)
- **Props**: `feedback` (string, optional)
- **State**: None (Pure presentational)
- **Structure**:
    - Outer Wrapper: Full-width `section`, `relative`, `overflow-hidden`. Handles background colors/patterns.
    - Inner Container: `max-w-6xl`, `mx-auto`, `px-4`. Handles content alignment.
    - Content:
        - Badge: "FRESH IDS" (Styled pill)
        - H1: "Generate UUIDs Instantly"
        - P: Subheadline
        - Actions: "Learn More" (External)
        - Background: Abstract shapes/gradients via CSS/SVG.

#### `App` (Refactor)
- **Change**: Move `Hero` outside the main restricted container or restructure the main layout to allow full-width sections.

### Testing Plan

#### Automated Tests
- **Unit**: `src/components/Hero.test.jsx`
    - Verify rendering of H1, Badge.
    - Verify "Learn More" link has `target="_blank"` and `rel="noopener noreferrer"`.
    - Verify secondary button text.

#### Manual Verification
- **Responsiveness**: Check mobile (stacked), tablet, and desktop (full-bleed) layouts.
- **Theming**: Toggle Light/Dark mode. Verify background, text contrast, and accent colors adapt instantly.
- **Visuals**: Compare against embedded design screenshot `specs/005-enhanced-hero-design/assets/design.png`.

## Project Structure

### Documentation (this feature)

```text
specs/005-enhanced-hero-design/
├── plan.md              # This file
├── spec.md              # Feature specification
├── tasks.md             # Execution tasks
└── assets/              # Design references
    └── design.png
```

### Source Code

```text
src/
├── App.jsx              # Refactor layout
├── components/
│   └── Hero.jsx         # Enhanced implementation
└── App.css              # Theme variables for hero patterns
```
