import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser'; // 🔥 import corect pentru Node 22

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); // 🔥 OBLIGATORIU pentru JWT în cookie

  app.enableCors({
    origin: [
      'https://electrohub-frontend.vercel.app',
      'http://localhost:3000'
    ],
    credentials: true,
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Server running on port ${port}`);
}

bootstrap();
