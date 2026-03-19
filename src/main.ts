import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware standard
  app.use(cookieParser());

  // Validare globală
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS pentru toate domeniile Vercel ale proiectului
  app.enableCors({
    origin: [
      'https://electrohub-frontend.vercel.app',
      /\.vercel\.app$/,
    ],
    credentials: true,
  });

  // Pornire server pe portul Railway
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Server running on port ${port}`);
}

bootstrap();
