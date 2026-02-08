import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  create(data: any) {
    return this.prisma.user.create({ data });
  }

  updateRefreshToken(id: number, refreshToken: string) {
    return this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  findByRefreshToken(refreshToken: string) {
    return this.prisma.user.findFirst({
      where: { refreshToken },
    });
  }

  clearRefreshToken(refreshToken: string) {
    return this.prisma.user.updateMany({
      where: { refreshToken },
      data: { refreshToken: null },
    });
  }
}
