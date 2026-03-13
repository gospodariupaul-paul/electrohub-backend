import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule, // necesar pentru req.user
  ],
  controllers: [NotificationController],
  providers: [NotificationService, PrismaService],
  exports: [NotificationService], // 🔥 OBLIGATORIU pentru ProductsModule
})
export class NotificationModule {}
