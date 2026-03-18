import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any, info: any, context: any) {
    const req = context.switchToHttp().getRequest();

    const publicPaths = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/products",
      "/categories",
      "/verify/request",
      "/verify/confirm",
    ];

    if (publicPaths.some(path => req.path.includes(path))) {
      return user;
    }

    if (err || !user) {
      throw new UnauthorizedException("Trebuie să fii autentificat.");
    }

    // 🔥 FIX: verificăm doar dacă user există
    if (user && !user.isVerified) {
      throw new UnauthorizedException("Cont neverificat");
    }

    return user;
  }
}
