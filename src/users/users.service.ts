import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // DEBUG: vedem dacă Prisma și conexiunea la DB merg
  async test() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
      return users;
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
