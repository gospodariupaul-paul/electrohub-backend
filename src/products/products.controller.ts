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

  @Post('create')
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body()
    body: {
      name: string;
      price: any;
      description: string;
      categoryId: any;
      stock: any;
    },
  ) {
    const { name, price, description, categoryId, stock } = body;

    return this.productsService.create({
      name,
      price: Number(price),
      description,
      categoryId: Number(categoryId),
      stock: Number(stock),
      images: files,
    });
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
