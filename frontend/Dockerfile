FROM node:20-alpine AS builder

WORKDIR /app

COPY frontend/level-up/package*.json .

RUN npm ci

COPY frontend/level-up . 

RUN npm run build

FROM nginx:stable-alpine AS production

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]