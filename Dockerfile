FROM node:20-slim

# Install required system packages
RUN apt-get update && apt-get install -y openssl python3 build-essential

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# ⭐ Copiem explicit folderul public (logo.png) înainte de COPY . .
COPY public ./public

# Copy the rest of the project
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the NestJS project
RUN npm run build

# Expose port
EXPOSE 3000

# Run migrations + start the app
CMD ["sh", "-c", "npx prisma db push && node dist/main.js"]
