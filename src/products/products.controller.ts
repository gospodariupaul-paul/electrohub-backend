import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // 🔥 RUTA TA ORIGINALĂ — O LĂSĂM AȘA
  @Post('create')
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body()
    body: {
      name: string;
      price: number;
      description: string;
      categoryId: number;
      stock: number;
    },
  ) {
    return this.productsService.create({
      ...body,
      price: Number(body.price),
      categoryId: Number(body.categoryId),
      stock: Number(body.stock),
      images: files,
    });
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(Number(id));
  }

  // 🔥 DELETE — FĂRĂ SĂ ATINGEM UPLOAD-UL
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productsService.remove(Number(id));
  }
}
