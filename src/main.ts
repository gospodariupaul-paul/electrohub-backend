import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

// 🔥 Importăm ruta Express pentru users
import userRoutes from './routes/users';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware standard
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS pentru frontend
  app.enableCors({
    origin: 'https://electrohub-frontend.vercel.app',
    credentials: true,
  });

  // 🔥 AICI conectăm ruta Express în NestJS
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use('/api', userRoutes);

  // Pornire server
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Server running on port ${port}`);
}

bootstrap();
