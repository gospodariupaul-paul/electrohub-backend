import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // DTO simplu, poți să-l muți într-un fișier separat dacă vrei
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

    // access token cu rol
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, role: user.role },
      { expiresIn: '15m' },
    );

    // refresh token simplu, doar cu sub
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id },
      { expiresIn: '7d' },
    );

    // hash-uim refresh token-ul înainte să-l salvăm
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
      // verificăm semnătura JWT
      const payload = await this.jwt.verifyAsync<{ sub: number }>(
        refreshToken,
      );

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // comparăm tokenul primit cu hash-ul din DB
      const valid = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!valid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // generăm un nou access token (poți pune și role aici)
      const newAccessToken = await this.jwt.signAsync(
        { sub: user.id, role: user.role },
        { expiresIn: '15m' },
      );

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    try {
      const payload = await this.jwt.verifyAsync<{ sub: number }>(
        refreshToken,
      );

      // ștergem refresh token-ul din DB
      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { refreshToken: null },
      });

      return { message: 'Logged out' };
    } catch {
      // dacă tokenul e deja invalid, oricum nu mai contează în DB
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
