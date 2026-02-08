import {
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwt.signAsync(
      { sub: user.id, role: user.role },
      {
        expiresIn: '15m',
        secret: process.env.JWT_ACCESS_SECRET,
      },
    );

    const refreshToken = await this.jwt.signAsync(
      { sub: user.id },
      {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      },
    );

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefresh },
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    try {
      const payload = await this.jwt.verifyAsync<{ sub: number }>(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const valid = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!valid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = await this.jwt.signAsync(
        { sub: user.id, role: user.role },
        {
          expiresIn: '15m',
          secret: process.env.JWT_ACCESS_SECRET,
        },
      );

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: number }>(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { refreshToken: null },
      });

      return { message: 'Logged out' };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
