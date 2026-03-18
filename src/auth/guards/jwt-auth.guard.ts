import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any, info: any, context: any) {
    const req = context.switchToHttp().getRequest();

    // Rute publice (nu cer token)
    const publicPaths = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/products",
      "/categories",
      "/verify/request",
      "/verify/confirm",
    ];

    // Dacă ruta este publică → nu verificăm userul
    if (publicPaths.some(path => req.path.includes(path))) {
      return user;
    }

    // Dacă nu există user → token lipsă sau invalid
    if (err || !user) {
      throw new UnauthorizedException("Trebuie să fii autentificat.");
    }

    // Dacă userul nu este verificat → blocăm accesul la rutele protejate
    if (!user.isVerified) {
      throw new UnauthorizedException("Cont neverificat");
    }

    return user;
  }
}
