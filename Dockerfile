# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (leverage cache)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build && npm prune --production

# Stage 2: Runtime
FROM nginx:alpine AS runtime

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create non-root user 'app'
RUN adduser -D -H -u 1000 -s /bin/false app

# Copy build artifacts
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf

# Set permissions for non-root execution
RUN touch /var/run/nginx.pid && \
    mkdir -p /var/cache/nginx /var/log/nginx && \
    chown -R app:app /var/run/nginx.pid /var/cache/nginx /var/log/nginx /etc/nginx/conf.d /usr/share/nginx/html

USER app

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
