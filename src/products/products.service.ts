import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // CREATE PRODUCT
  async create(data: {
    name: string;
    price: number;
    description: string;
    categoryId: number;
    stock: number;
    images: string[];
    userId: number;
  }) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        description: data.description,
        stock: data.stock,
        images: data.images,

        // 🔥 FIX FINAL — conectăm categoria doar dacă există în DB
        ...(data.categoryId && data.categoryId !== 0
          ? { category: { connect: { id: Number(data.categoryId) } } }
          : {}),

        user: { connect: { id: data.userId } },
      },
    });
  }

  // GET ALL PRODUCTS (doar active)
  async findAll() {
    return this.prisma.product.findMany({
      where: { status: 'active' },
      include: {
        category: true,
        user: true,
      },
    });
  }

  // GET PRODUCT BY ID
  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        user: true,
      },
    });
  }

  // GET PRODUCTS BY USER
  async getProductsByUser(userId: number) {
    return this.prisma.product.findMany({
      where: { userId },
      include: {
        category: true,
        user: true,
      },
    });
  }

  // DELETE PRODUCT
  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  // 🔥 MARCHEAZĂ PRODUSUL CA VÂNDUT
  async markAsSold(id: number) {
    return this.prisma.product.update({
      where: { id },
      data: { status: 'sold' },
    });
  }
}
