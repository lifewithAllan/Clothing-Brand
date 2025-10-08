# ------------------------------------------------------
# 🧩 Stage 1: Build React + TypeScript App
# ------------------------------------------------------
FROM node:lts-alpine AS build

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy the rest of the app
COPY . .

# Build production-ready static files (runs TypeScript compile automatically)
RUN npm run build

# ------------------------------------------------------
# 🌐 Stage 2: Serve with Nginx
# ------------------------------------------------------
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Optional: custom Nginx config (for React Router)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]