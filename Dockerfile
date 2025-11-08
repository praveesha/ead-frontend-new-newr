# Stage 1: Build the Vite app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies. Use npm ci when a lockfile exists, otherwise fallback to npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy the rest of the source
COPY . .

# Build the production assets
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine AS runner

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built assets from builder
COPY --from=builder /app/dist ./

# Replace default nginx config with our SPA-friendly config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000 (nginx will be configured to listen on 3000 to avoid conflict with backend on 8080)
EXPOSE 3000

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]