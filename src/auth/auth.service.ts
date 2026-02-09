import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // -------------------------
  // LOGIN
  // -------------------------
  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.issueTokens(user.id, user.email, user.role);

    await this.saveRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  // -------------------------
  // REFRESH TOKEN
  // -------------------------
  async refresh(dto: { refreshToken: string }) {
    const { refreshToken } = dto;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    let payload: any;

    try {
      payload = this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.issueTokens(user.id, user.email, user.role);

    await this.saveRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  // -------------------------
  // LOGOUT
  // -------------------------
  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { message: 'Logged out' };
  }

  // -------------------------
  // GENERARE TOKEN‑URI
  // -------------------------
  async issueTokens(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const access_token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refresh_token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_token,
    };
  }

  // -------------------------
  // SALVARE REFRESH TOKEN
  // -------------------------
  async saveRefreshToken(userId: number, token: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  }
}
