import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Hash password
    const hashed = await argon.hash(dto.password);

    // Create user in DB
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        role: 'USER', // 🔥 OBLIGATORIU pentru schema ta Prisma
      },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await argon.verify(user.password, dto.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const access_token = await this.jwt.signAsync(
      { sub: user.id, email: user.email },
      { expiresIn: '15m' },
    );

    const refresh_token = await this.jwt.signAsync(
      { sub: user.id },
      { expiresIn: '7d' },
    );

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refresh(refresh_token: string) {
    try {
      const payload = await this.jwt.verifyAsync(refresh_token);

      const access_token = await this.jwt.signAsync(
        { sub: payload.sub },
        { expiresIn: '15m' },
      );

      return { access_token };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
