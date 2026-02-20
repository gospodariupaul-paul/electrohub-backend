import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      name: string;
      price: number;
      description: string;
      categoryId: number;
      stock: number;
    },
  ) {
    const { name, price, description, categoryId, stock } = body;

    // Upload imagine în Cloudinary
    const uploaded: any = await this.cloudinaryService.uploadImage(file);

    // Trimitem datele către service
    return this.productsService.create({
      name,
      price: Number(price),
      description,
      categoryId: Number(categoryId),
      stock: Number(stock),
      image: file,
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
