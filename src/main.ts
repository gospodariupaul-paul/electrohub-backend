import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(3000);
  console.log("🔥🔥🔥 APP STARTED 🔥🔥🔥");
}

bootstrap();
