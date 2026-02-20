import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(data: {
    name: string;
    price: number;
    description: string;
    categoryId: number;
    stock: number;
    image: Express.Multer.File;
  }) {
    const { name, price, description, categoryId, stock, image } = data;

    const uploadResult: any = await this.cloudinaryService.uploadImage(image);

    return this.prisma.product.create({
      data: {
        name,
        price,
        description,
        stock, // 🔥 AICI ESTE CHEIA
        imageUrl: uploadResult.secure_url,
        category: categoryId
          ? { connect: { id: categoryId } }
          : undefined,
      },
    });
  }
}
