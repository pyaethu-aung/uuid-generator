# Quickstart: Docker Containerization

This guide explains how to build, run, and develop with the UUID Generator Docker container.

## Prerequisites

- Docker Desktop or Docker Engine (19.03+)
- Node.js 20+ (for local scripts, optional)

## 1. Building the Image

Build the production-optimized image locally:

```bash
docker build -t uuid-generator:local .
```

Verify image size (target < 25MB):

```bash
docker images uuid-generator:local
```

## 2. Running Locally

Run the container on port 8080:

```bash
docker run --rm \
  -p 8080:80 \
  --name uuid-app \
  --read-only \
  --cap-drop ALL \
  --tmpfs /var/cache/nginx \
  --tmpfs /var/run \
  --tmpfs /tmp \
  uuid-generator:local
```

Access the app at [http://localhost:8080](http://localhost:8080).

## 3. Security Scanning

Ran local Trivy scan:

```bash
# Scan config (Dockerfile)
trivy config Dockerfile

# Scan built image
trivy image uuid-generator:local
```

## 4. Development Workflow

While Docker is primarily for production artifacts, you can verify changes locally:

1. Make changes to source code.
2. Rebuild: `docker build -t uuid-generator:local .`
3. Rerun container.

(Note: For rapid development with hot-reload, stick to `npm run dev` outside Docker).

## 5. Troubleshooting

**"Read-only file system" errors**:
Ensure `--tmpfs` mounts are provided for Nginx temporary directories (`/var/cache/nginx`, `/var/run`, `/tmp`).

**App 404s on refresh**:
This is an SPA. Nginx must be configured with `try_files $uri /index.html`. Verify `nginx.conf` is correctly copied.
