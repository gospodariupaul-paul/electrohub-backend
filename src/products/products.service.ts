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
    images: Express.Multer.File[];
  }) {
    const { name, price, description, categoryId, stock, images } = data;

    const uploadedImages: string[] = [];

    for (const img of images) {
      const uploadResult: any = await this.cloudinaryService.uploadImage(img);
      uploadedImages.push(uploadResult.secure_url);
    }

    return this.prisma.product.create({
      data: {
        name,
        price,
        description,
        stock,
        images: uploadedImages,
        category: { connect: { id: categoryId } },
      },
    });
  }

  findAll() {
    return this.prisma.product.findMany();
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
