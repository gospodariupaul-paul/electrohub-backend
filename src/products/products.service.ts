import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any, userId: number) {
    // ❗ NU mai folosim ...dto — filtrăm manual câmpurile permise
    const data: any = {
      name: dto.name,
      price: dto.price,
      description: dto.description,
      images: dto.images,
      stock: dto.stock ?? 0,
      categoryId: dto.categoryId ?? null,
      status: dto.status ?? 'active',
      userId,
    };

    return this.prisma.product.create({ data });
  }

  async findAll() {
    return this.prisma.product.findMany({
      where: { status: 'active' },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.product.findMany({
      where: { userId },
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  // 🔥 SINGURA METODĂ NOUĂ — NECESARĂ PENTRU CATEGORII
  async findByCategory(categoryId: number) {
    return this.prisma.product.findMany({
      where: {
        categoryId,
        status: 'active',
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, dto: any, userId: number, role: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Produsul nu există');
    }

    if (product.userId !== userId && role !== 'admin') {
      throw new ForbiddenException('Nu poți modifica produsul altui utilizator');
    }

    // ❗ Filtrăm câmpurile permise
    const data: any = {
      name: dto.name,
      price: dto.price,
      description: dto.description,
      images: dto.images,
      status: dto.status ?? product.status,
    };

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userId: number, role: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Produsul nu există');
    }

    if (product.userId !== userId && role !== 'admin') {
      throw new ForbiddenException('Nu poți șterge produsul altui utilizator');
    }

    return this.prisma.product.update({
      where: { id },
      data: { status: 'deleted' },
    });
  }
}
