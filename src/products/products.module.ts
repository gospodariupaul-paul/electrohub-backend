import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PrismaModule,       // acces DB
    CloudinaryModule,   // upload imagini
    PassportModule,     // 🔥 OBLIGATORIU pentru req.user
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
