import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activăm CORS (opțional, dar recomandat)
  app.enableCors();

  // Validare globală pentru toate DTO-urile
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // elimină câmpurile care nu sunt în DTO
      forbidNonWhitelisted: false, // nu aruncă eroare, doar le ignoră
      transform: true,            // transformă automat string → number etc.
    }),
  );

  // Configurare Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Documentația completă a backend-ului')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Pornim serverul
  await app.listen(3000);
}
bootstrap();
