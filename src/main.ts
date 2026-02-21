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

  // IMPORTANT pentru Render:
  // Render setează automat PORT (ex: 10000)
  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');
  console.log(`Server running on port ${port}`);
}

bootstrap();

console.log("Cloudinary KEY:", process.env.CLOUDINARY_API_KEY);
