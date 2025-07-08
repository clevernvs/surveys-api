FROM node:20-alpine3.21

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Gere o Prisma Client apontando para o schema correto
RUN npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 3001

CMD npx prisma generate --schema=./prisma/schema.prisma && npm run dev