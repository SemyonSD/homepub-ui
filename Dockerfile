# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Replace OAuth redirect origin at build time (default localhost; for Render use --build-arg APP_ORIGIN=https://your-app.onrender.com)
ARG APP_ORIGIN=https://homepub-ui.onrender.com/
RUN sed -i "s|__APP_ORIGIN__|$APP_ORIGIN|g" src/environments/environment.docker.ts

RUN npm run build -- --configuration=docker

# Production stage: serve with nginx
FROM nginx:alpine

COPY --from=builder /app/dist/home-pubv16 /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Replace backend URL at build time (default Docker Compose api:3000; for Render use --build-arg BACKEND_URL=https://your-api.onrender.com)
ARG BACKEND_URL=http://api:3000
RUN sed -i "s|http://api:3000|$BACKEND_URL|g" /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
