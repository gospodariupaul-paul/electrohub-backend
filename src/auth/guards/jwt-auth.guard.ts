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
      "/",
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/products",
      "/categories",
      "/verify/request",
      "/verify/confirm",
      "/utilizatori-online",
      "/dashboard",
      "/settings",
      "/notifications",
      "/favorites",
      "/my-account",
    ];

    // rute publice
    if (publicPaths.some(path => req.path.startsWith(path))) {
      return user;
    }

    // GET fără token → nu aruncăm eroare
    if (req.method === "GET" && !user) {
      return null;
    }

    // token lipsă sau invalid
    if (err || !user) {
      throw new UnauthorizedException("Trebuie să fii autentificat.");
    }

    // cont neverificat
    if (user && !user.isVerified) {
      throw new UnauthorizedException("Cont neverificat");
    }

    return user;
  }
}
