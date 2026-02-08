import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  create(data: any) {
    return this.prisma.user.create({
      data,
    });
  }

  findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async changePassword(id: number, dto: any) {
    const hashed = await bcrypt.hash(dto.newPassword, 10);

    return this.prisma.user.update({
      where: { id },
      data: { password: hashed },
    });
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

  // 🔥 AICI ESTE MODIFICAREA IMPORTANTĂ
  async clearRefreshToken(refreshToken: string): Promise<boolean> {
    const result = await this.prisma.user.updateMany({
      where: { refreshToken },
      data: { refreshToken: null },
    });

    return result.count > 0;
  }
}
