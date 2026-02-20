import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://electrohub-frontend.vercel.app',
      'http://localhost:3000'
    ],
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
console.log("Cloudinary KEY:", process.env.CLOUDINARY_API_KEY);