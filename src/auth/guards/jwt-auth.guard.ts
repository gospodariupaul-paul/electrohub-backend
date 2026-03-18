import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any, info: any, context: any) {
    const req = context.switchToHttp().getRequest();

    // Rute care NU necesită autentificare
    const publicPaths = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/verify/request",
      "/verify/confirm",
    ];

    // Dacă ruta este publică → permitem accesul fără user
    if (publicPaths.some(path => req.path.includes(path))) {
      return user;
    }

    // Dacă nu există user → nu e autentificat
    if (err || !user) {
      throw new UnauthorizedException("Trebuie să fii autentificat.");
    }

    // Dacă userul nu este verificat → blocăm accesul la restul rutelor
    if (!user.isVerified) {
      throw new UnauthorizedException("Cont neverificat");
    }

    return user;
  }
}
