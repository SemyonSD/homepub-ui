# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration=docker

# Production stage: serve with nginx
FROM nginx:alpine

COPY --from=builder /app/dist/home-pubv16 /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# For Render (or any host where API is not at api:3000), pass at build time:
#   docker build --build-arg BACKEND_URL=https://homepub.onrender.com ...
ARG BACKEND_URL=http://api:3000
RUN sed -i "s|http://api:3000|$BACKEND_URL|g" /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
