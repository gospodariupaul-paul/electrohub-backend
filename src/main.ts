import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { runSeed } from './seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'production') {
    const prisma = app.get(PrismaService);
    await runSeed(prisma);
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
