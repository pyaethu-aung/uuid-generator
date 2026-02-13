# Research & Technical Decisions: Docker Containerization

## 1. Multi-Stage Build Strategy
**Decision**: Use a 2-stage build: `node:20-alpine` (builder) -> `nginx:1.25-alpine` (runtime).
**Rationale**:
- **Size**: separates build tools (node, npm, gcc) from runtime artifacts.
- **Security**: Nginx image is minimal and designed for serving static files.
- **Optimization**: `npm ci` in builder stage ensures deterministic builds.
**Alternatives Considered**:
- *Distroless Node*: Good for backend apps, but we need Nginx to serve static files for SPA.
- *Single Stage*: Results in bloated image (>500MB) with unnecessary attack surface.

## 2. Base Image Selection
**Decision**: `alpine` variants for both stages.
**Rationale**:
- Smallest footprint (<10MB base).
- Security hardening (smaller attack surface).
- **Trade-off**: `musl` libc compatibility issues (rare for pure JS/static apps).
**Mitigation**: If specific native modules fail (e.g. sharp), we will add `libc6-compat` or switch to `debian-slim`, but for standard Vite React apps, Alpine is standard.

## 3. Security Hardening
**Decision**:
- **Non-root user**: Create/use `nginx` user.
- **Read-only FS**: `read_only: true` container config.
- **Caps**: Drop all capabilities, add none.
- **Mounts**: usage of `tmpfs` for `/var/cache/nginx`, `/var/run`, `/tmp` to allow Nginx operation without writing to root.
**Rationale**: Prevents privilege escalation and persistence.

## 4. CI/CD Architecture
**Decision**: Single `docker-publish.yml` workflow with conditional logic.
- **Triggers**: `push` to main, `pull_request`, `release`.
- **Flow**:
  1. `hadolint` (lint)
  2. `docker build` (test build)
  3. `trivy` (scan, fail on fixable HIGH/CRITICAL)
  4. `docker push` (if main/release)
**Rationale**: Keeps pipeline simple but guarded.

## 5. Nginx Configuration for SPA
**Decision**: Custom `nginx.conf` handling:
- `try_files $uri $uri/ /index.html` for client-side routing.
- Gzip/Brotli compression enabled.
- Security Headers: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`.
**Rationale**: Default Nginx config does not handle SPA routing (404s on refresh) and lacks security headers.
