import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // Preluăm URL-urile din .env cu fallback-uri
  const FRONTEND_URL = process.env.FRONTEND_URL || 'https://electrohub-frontend.vercel.app';
  const LOCAL_URL = process.env.LOCAL_URL || 'http://localhost:3000';

  app.enableCors({
    origin: [FRONTEND_URL, LOCAL_URL],
    credentials: true,
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Server running on port ${port}`);
}

bootstrap();
