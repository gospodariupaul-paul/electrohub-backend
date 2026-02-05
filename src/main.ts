import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';

async function bootstrap() {
  // Test DB connection
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log("🔥 Connected to DB successfully!");
  } catch (err) {
    console.error("❌ Failed to connect to DB:", err);
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(3000);
  console.log("🔥🔥🔥 APP STARTED WITH NEW CODE 🔥🔥🔥");
}

bootstrap();
