import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    price: number;
    description: string;
    categoryId: number;
    stock: number;
    images: string[]; // 🔥 URL-uri Cloudinary, nu fișiere
  }) {
    const { name, price, description, categoryId, stock, images } = data;

    // 🔥 NU MAI FACEM UPLOAD LA CLOUDINARY AICI
    // 🔥 PRIMIM DIRECT URL-URILE DIN FRONTEND

    return this.prisma.product.create({
      data: {
        name,
        price,
        description,
        stock,
        images, // 🔥 URL-urile Cloudinary sunt salvate direct
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
