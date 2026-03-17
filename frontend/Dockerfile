# Stage 1: Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Pass build arguments (e.g., API URL)
ARG VITE_MAIN_API_URL
ARG VITE_GOOGLE_MAPS_KEY
ENV VITE_MAIN_API_URL=$VITE_MAIN_API_URL
ENV VITE_GOOGLE_MAPS_KEY=$VITE_GOOGLE_MAPS_KEY

# Copy application files and build
COPY . .
RUN npm run build

# Stage 2: Serve stage 
FROM nginx:alpine

# Copy built files from build stage to nginx's public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Add custom nginx config for SPA routing (if needed)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
