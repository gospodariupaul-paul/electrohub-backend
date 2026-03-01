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
    stock: number;
    images: string[];
    userId: number;
    category: string; // 🔥 ADĂUGAT — categoria detectată automat
  }) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        description: data.description,
        stock: data.stock,
        images: data.images,
        status: 'active',

        // 🔥 Conectăm categoria după SLUG, nu după ID
        category: {
          connect: {
            slug: data.category, // ex: "telefoane", "laptopuri"
          },
        },

        user: { connect: { id: Number(data.userId) } },
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
      where: { userId: Number(userId) },
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

  // MARCHEAZĂ PRODUSUL CA VÂNDUT
  async markAsSold(id: number) {
    return this.prisma.product.update({
      where: { id },
      data: { status: 'sold' },
    });
  }

  // UPDATE PRODUCT
  async update(
    id: number,
    data: {
      name?: string;
      price?: number;
      description?: string;
      images?: string[];
    },
  ) {
    return this.prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.price && { price: Number(data.price) }),
        ...(data.description && { description: data.description }),
        ...(data.images && { images: data.images }),
      },
    });
  }
}
