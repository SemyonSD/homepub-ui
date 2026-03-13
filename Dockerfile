# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration=docker

# Production stage: serve with nginx
FROM nginx:alpine
RUN apk add --no-cache gettext

COPY --from=builder /app/dist/home-pubv16 /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
RUN rm -f /etc/nginx/conf.d/default.conf

ENV PORT=80
ENV API_UPSTREAM=http://api:3000

EXPOSE 80

CMD ["/entrypoint.sh"]
