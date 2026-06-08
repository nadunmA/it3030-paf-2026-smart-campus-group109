# ══════════════════════════════════════════════════════════════════
# Smart Campus – Frontend Production Dockerfile
# Stack : React 19 + Vite 8 + TailwindCSS 4
# Served : Nginx (Port 80)
# ══════════════════════════════════════════════════════════════════

# ── Stage 1: Build Stage ──────────────────────────────────────────
# Use Node.js environment to compile and build the frontend assets
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package management files to leverage Docker layer caching
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire frontend source code and Nginx configuration
COPY . .

# Generate production build (Outputs static assets to /app/dist)
RUN npm run build

# ── Stage 2: Runtime Stage ────────────────────────────────────────
# Use a lightweight Nginx server to serve production-ready static files
FROM nginx:alpine AS runtime

# Copy custom Nginx configuration for SPA routing and API proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static assets from the builder stage into Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port 80 to allow incoming web traffic
EXPOSE 80

# Health check to ensure Nginx server is alive and responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

# Start Nginx in the foreground to keep the container running
CMD ["nginx", "-g", "daemon off;"]