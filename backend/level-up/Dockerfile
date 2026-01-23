FROM node:20

WORKDIR /usr/src/app

COPY package.json package-lock.json ./


RUN npm ci --only=production


COPY prisma ./prisma

RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
