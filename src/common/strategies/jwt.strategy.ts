import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 🔥 EXTRACTOR CORECT — ia token-ul din cookie
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.jwt || null;
        },
      ]),

      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  // 🔥 Ce ajunge în req.user
  async validate(payload: any) {
    return {
      id: payload.sub,   // user.id
      email: payload.email,
      role: payload.role,
    };
  }
}
