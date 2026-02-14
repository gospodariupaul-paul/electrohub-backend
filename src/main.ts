import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: [
      "http://localhost:3000",
      "https://electrohub-frontend.vercel.app",
      /\.vercel\.app$/, // permite toate domeniile Vercel (preview deploys)
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT || 10000);
}
bootstrap();
