FROM node:20-slim

# Install required system packages
RUN apt-get update && apt-get install -y openssl python3 build-essential

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the NestJS project
RUN npm run build

# Expose port
EXPOSE 8080

# Start the app
CMD ["npm", "run", "start:prod"]
