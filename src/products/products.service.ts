import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any, userId: number) {
    return this.prisma.product.create({
      data: {
        ...dto,
        userId,
      },
    });
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

  async update(id: number, dto: any, userId: number, role: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Produsul nu există');
    }

    // 🔥 Adminul poate modifica ORICE
    if (product.userId !== userId && role !== 'admin') {
      throw new ForbiddenException('Nu poți modifica produsul altui utilizator');
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, userId: number, role: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Produsul nu există');
    }

    // 🔥 FIX FINAL: Adminul poate șterge ORICE produs
    if (product.userId !== userId && role !== 'admin') {
      throw new ForbiddenException('Nu poți șterge produsul altui utilizator');
    }

    return this.prisma.product.update({
      where: { id },
      data: { status: 'deleted' },
    });
  }
}
