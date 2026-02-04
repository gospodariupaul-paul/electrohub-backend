import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],   // 🔥 OBLIGATORIU
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
