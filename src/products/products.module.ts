import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PassportModule } from '@nestjs/passport';
import { NotificationModule } from '../notification/notification.module'; // 🔥 ADĂUGAT

@Module({
  imports: [
    PrismaModule,       // acces DB
    CloudinaryModule,   // upload imagini
    PassportModule,     // necesar pentru req.user
    NotificationModule, // 🔥 ADĂUGAT — REZOLVĂ EROAREA
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
