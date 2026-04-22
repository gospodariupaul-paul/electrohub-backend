FROM node:20-slim

# Install required system packages
RUN apt-get update && apt-get install -y openssl python3 build-essential

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy public assets
COPY public ./public

# Copy the rest of the project
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the NestJS project
RUN npm run build

# Set default port (Render will override it)
ENV PORT=3000

# Expose internal container port
EXPOSE 3000

# Run migrations + start the app
CMD ["sh", "-c", "npx prisma db push && node dist/main.js"]
