import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    price: number;
    description: string;
    stock: number;
    images: string[];
    userId: number;
    category: string;
  }) {
    const category = await this.prisma.category.findFirst({
      where: {
        name: {
          equals: data.category,
          mode: 'insensitive',
        },
      },
    });

    if (!category) {
      throw new NotFoundException(
        `Categoria '${data.category}' nu există în baza de date.`,
      );
    }

    // 🔥 1. Creează produsul
    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        description: data.description,
        stock: data.stock,
        images: data.images,
        status: 'active',

        category: {
          connect: { id: category.id },
        },

        user: { connect: { id: Number(data.userId) } },
      },
    });

    // 🔥 2. Ia toți userii din baza de date
    const users = await this.prisma.user.findMany();

    // 🔥 3. Creează notificări pentru TOȚI userii
    for (const u of users) {
      await this.prisma.notification.create({
        data: {
          userId: u.id,
          text: `Un utilizator a publicat un anunț nou: ${product.name}`,
          link: `/product/${product.id}`,
          read: false,
        },
      });
    }

    return product;
  }

  async findAll() {
    return this.prisma.product.findMany({
      where: { status: 'active' },
      include: { category: true, user: true },
    });
  }

  async findByCategory(slug: string) {
    return this.prisma.product.findMany({
      where: {
        category: {
          name: {
            equals: slug,
            mode: 'insensitive',
          },
        },
      },
      include: { category: true, user: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true, user: true },
    });
  }

  async getProductsByUser(userId: number) {
    return this.prisma.product.findMany({
      where: { userId: Number(userId) },
      include: { category: true, user: true },
    });
  }

  async remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }

  async markAsSold(id: number) {
    return this.prisma.product.update({
      where: { id },
      data: { status: 'sold' },
    });
  }

  async update(
    id: number,
    data: { name?: string; price?: number; description?: string; images?: string[] },
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
