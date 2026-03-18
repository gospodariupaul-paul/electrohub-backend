import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.jwt || null,
      ]),

      ignoreExpiration: false,

      // 🔥 SECRETUL CORECT — trebuie să fie JWT_ACCESS_SECRET
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,        // 🔥 FIX: token-ul tău folosește "sub", nu "id"
      email: payload.email,
      role: payload.role,
      isVerified: payload.isVerified,
    };
  }
}
