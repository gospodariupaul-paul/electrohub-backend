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

    // Upload multiple images to Cloudinary
    const uploadedImages: string[] = [];

    for (const img of images) {
      const uploadResult: any = await this.cloudinaryService.uploadImage(img);
      uploadedImages.push(uploadResult.secure_url);
    }

    // Save product with images array
    return this.prisma.product.create({
      data: {
        name,
        price,
        description,
        stock,
        images: uploadedImages, // ARRAY DE IMAGINI
        category: categoryId ? { connect: { id: categoryId } } : undefined,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: { category: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
