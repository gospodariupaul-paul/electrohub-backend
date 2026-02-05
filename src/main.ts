import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log("🔥🔥🔥 APP STARTED WITH NEW CODE 🔥🔥🔥");

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',                 // local dev (Vite)
      'http://localhost:3000',                 // local fallback
      'https://electrohub-frontend.netlify.app', // Netlify
      'https://electrohub-frontend.vercel.app',  // Vercel
      'https://electrohub-frontend.onrender.com' // Render frontend
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
