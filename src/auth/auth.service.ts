import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // 🔐 Verifică email + parolă
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email sau parolă greșită');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Email sau parolă greșită');
    }

    return user;
  }

  // 🔥 Login — generează token JWT
  async login(user: any) {
    const payload = {
      sub: user.id,       // ID-ul real din baza de date
      role: user.role,    // rolul userului
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // 🆕 Register — creează user + token
  async register(dto: any) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    const payload = {
      sub: newUser.id,
      role: newUser.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
