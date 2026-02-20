import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    PrismaModule,       // 🔥 OBLIGATORIU
    CloudinaryModule,   // pentru upload imagini
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
