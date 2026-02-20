import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    PrismaModule,        // 🔥 AICI ERA PROBLEMA
    CloudinaryModule,    // pentru upload imagini
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
