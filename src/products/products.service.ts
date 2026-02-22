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
    images: string[];
    userId: number; // 🔥 ADĂUGAT
  }) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        description: data.description,
        stock: data.stock,
        images: data.images,
        category: { connect: { id: data.categoryId } },
        user: { connect: { id: data.userId } }, // 🔥 AICI ERA PROBLEMA
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: { category: true, user: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true, user: true },
    });
  }

  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
