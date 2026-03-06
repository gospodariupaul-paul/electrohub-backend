import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://electrohub-frontend.vercel.app',
      'http://localhost:3000'
    ],
    credentials: true,
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // 🔥 Răspuns corect pentru preflight OPTIONS (obligatoriu pentru cookie-uri)
  app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://electrohub-frontend.vercel.app');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.sendStatus(200);
  });

  // IMPORTANT pentru Render:
  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');
  console.log(`Server running on port ${port}`);
}

bootstrap();

console.log("Cloudinary KEY:", process.env.CLOUDINARY_API_KEY);
