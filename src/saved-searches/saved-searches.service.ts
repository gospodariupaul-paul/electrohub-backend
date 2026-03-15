import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SavedSearchesService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, query: string, filters: any) {
    return this.prisma.savedSearch.create({
      data: { userId, query, filters },
    });
  }

  findAll(userId: number) {
    return this.prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  delete(id: number, userId: number) {
    return this.prisma.savedSearch.deleteMany({
      where: { id, userId },
    });
  }
}
