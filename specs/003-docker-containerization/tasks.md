---
description: "Task list for Docker Containerization"
---

# Tasks: Docker Containerization

**Input**: Design documents from `/specs/003-docker-containerization/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Tests**: 
Tests are mandatory. After each task, run `npm run test`, `npm run lint`, and `npm run build` before merge.
For Docker tasks, testing involves `docker build` validation and `trivy` scanning.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create `.docker` directory and `.dockerignore` file in root
- [x] T002 Create `.github/workflows` directory if it doesn't exist

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create `nginx.conf` in `.docker/nginx.conf` with SPA routing and security headers
- [x] T004 Create initial `Dockerfile` in root with multi-stage structure (Node 20 + Nginx Alpine)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Secure Production Deployment (Priority: P1) 🎯 MVP

**Goal**: DevOps engineer can deploy secure, optimized Docker image to GHCR

**Independent Test**: Push code, verify image in GHCR, pull and run successfully

### Implementation for User Story 1

- [x] T005 [US1] Configure multi-stage build in `Dockerfile` (Builder stage)
- [x] T006 [US1] Configure multi-stage build in `Dockerfile` (Runtime stage with non-root user)
- [x] T007 [US1] Implement GitHub Actions workflow `docker-publish.yml` for build and push
- [x] T008 [US1] Add Trivy vulnerability scanning to `docker-publish.yml` (blocking fixable HIGH/CRITICAL)
- [x] T009 [US1] Add Hadolint linting to `docker-publish.yml`
- [x] T010 [US1] Add health check endpoint configuration in `.docker/nginx.conf`

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Local Development Parity (Priority: P2)

**Goal**: Developer can build and run production-like container locally

**Independent Test**: `docker build` and `docker run` locally work with expected ports

### Implementation for User Story 2

- [ ] T011 [US2] update `package.json` with `docker:build` and `docker:run` scripts for local convenience
- [ ] T012 [US2] Verify local build size < 25MB and document findings in `research.md` if different
- [ ] T013 [US2] Verify non-root user execution in local container (documentation/validation)

**Checkpoint**: User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Automated Security Compliance (Priority: P2)

**Goal**: Security engineer has automated checks for best practices and vulnerabilities

**Independent Test**: Pipeline fails on bad Dockerfile or vulnerable image

### Implementation for User Story 3

- [ ] T014 [US3] Configure daily schedule in `docker-publish.yml` for vulnerability scanning
- [ ] T015 [US3] Add `.trivyignore` file if needed for unfixable false positives (optional/on-demand)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T016 [P] Documentation updates in `README.md` (add Docker instructions)
- [ ] T017 [P] Verify `quickstart.md` instructions against final implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1
- **User Stories (Phase 3+)**: Depend on Phase 2
- **Polish (Final)**: Depends on all user stories

### User Story Dependencies

- **US1**: Foundation -> US1
- **US2**: Foundation -> US2 (Independent of US1, but shares Dockerfile)
- **US3**: Foundation -> US3 (Independent of US1/US2, helps optimize US1 pipeline)

### Parallel Opportunities

- T007, T010, T011 can be worked on in parallel after T004 is done.
- T014 (Schedule) is independent of T007 (Push flow) logic but modifies same file.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2 (Dockerfile + Config)
2. Complete Phase 3 (CI/CD Pipeline)
3. **STOP and VALIDATE**: Push to branch, check GHCR, pull image.

### Incremental Delivery

1. Foundation ready (Dockerfile works locally)
2. Add CI/CD (US1) -> Production ready
3. Add Dev scripts (US2) -> Developer experience
4. Add Schedules (US3) -> Security maturity
