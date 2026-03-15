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

  async delete(id: number, userId: number) {
    return this.prisma.savedSearch.delete({
      where: {
        id,
        // asigură-te că ștergi doar ce aparține userului
        userId,
      },
    });
  }
}
