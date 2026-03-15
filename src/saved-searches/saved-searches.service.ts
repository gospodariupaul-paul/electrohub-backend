import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SavedSearchesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, query: string, filters: any) {
    return this.prisma.savedSearch.create({
      data: {
        userId,
        query,
        filters,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ⭐ ȘTERGERE INDIVIDUALĂ — FOARTE IMPORTANT deleteMany()
  async delete(id: number, userId: number) {
    return this.prisma.savedSearch.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }

  // ⭐ ȘTERGERE TOTALĂ
  async deleteAll(userId: number) {
    return this.prisma.savedSearch.deleteMany({
      where: { userId },
    });
  }
}
