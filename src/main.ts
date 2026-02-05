import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log("🔥🔥🔥 APP STARTED WITH NEW CODE 🔥🔥🔥");

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  await app.listen(3000);
}
bootstrap();
