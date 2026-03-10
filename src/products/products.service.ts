import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // CREATE PRODUCT
  async create(data: any) {
    const category = await this.prisma.category.findFirst({
      where: {
        name: { equals: data.category, mode: 'insensitive' },
      },
    });

    if (!category) {
      throw new NotFoundException(`Categoria '${data.category}' nu există.`);
    }

    return this.prisma.product.create({
      data: {
        name: data.name || "",
        price: Number(data.price) || 0,
        stock: Number(data.stock) || 0,
        description: data.description || "",
        images: Array.isArray(data.images) ? data.images : [],
        status: "active",
        categoryId: category.id,
        userId: Number(data.userId),
      },
    });
  }

  // GET ACTIVE PRODUCTS
  async findAll() {
    return this.prisma.product.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
    });
  }

  // GET ALL PRODUCTS FOR ADMIN
  async findAllAdmin() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  // GET PRODUCT BY ID
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException("Produsul nu există");
    }

    return product;
  }

  // UPDATE PRODUCT
  async update(id: number, data: any) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException("Produsul nu există");
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
        description: data.description ?? undefined,
        price: data.price !== undefined ? Number(data.price) || 0 : undefined,
        stock: data.stock !== undefined ? Number(data.stock) || 0 : undefined,
        images: Array.isArray(data.images) ? data.images : undefined,
      },
    });
  }

  // 🔥 DELETE CARE FUNCȚIONEAZĂ 100% (SOFT DELETE SIMPLU)
  async remove(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException("Produsul nu există");
    }

    // Soft delete – schimbăm statusul
    return this.prisma.product.update({
      where: { id },
      data: {
        status: "deleted",
      },
    });
  }

  // GET PRODUCTS BY USER
  async findByUser(userId: number) {
    return this.prisma.product.findMany({
      where: { userId, status: "active" },
      orderBy: { createdAt: "desc" },
    });
  }
}
