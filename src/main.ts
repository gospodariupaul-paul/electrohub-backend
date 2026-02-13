import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "https://electrohub-frontend-git-main-gospodariupaul-pauls-projects.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  });

  app.setGlobalPrefix("api");

  await app.listen(process.env.PORT || 10000);
  console.log("Backend running on port " + (process.env.PORT || 10000));
}
bootstrap();
