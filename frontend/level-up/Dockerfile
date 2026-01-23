FROM node:20-alpine AS builder

WORKDIR /app

ARG REACT_APP_API_BASE
ENV REACT_APP_API_BASE=$REACT_APP_API_BASE

COPY package*.json .

RUN npm ci

COPY . . 

RUN npm run build

FROM nginx:stable-alpine AS production

COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
