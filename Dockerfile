FROM node:20-slim

# Install required system packages
RUN apt-get update && apt-get install -y openssl python3 build-essential

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy public folder
COPY public ./public

# Copy the rest of the project
COPY . .

# 🔥 IMPORTANT: Ștergem .env ca să nu suprascrie variabilele Render
RUN rm -f .env .env.local .env.production

# Generate Prisma Client
RUN npx prisma generate

# Build the NestJS project
RUN npm run build

EXPOSE 3000

ENTRYPOINT ["node", "dist/main.js"]
CMD []
