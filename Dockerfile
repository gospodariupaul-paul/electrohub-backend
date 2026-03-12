FROM node:20-slim

# Install OpenSSL 3
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client for OpenSSL 3
RUN npx prisma generate

RUN npm run build

CMD ["npm", "run", "start:prod"]
