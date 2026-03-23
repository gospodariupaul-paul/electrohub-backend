import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  // 🔥 Prevenim crash-ul Passport când nu există cookie
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    // Dacă nu există cookie jwt → nu lăsăm Passport să ruleze
    if (!req.cookies?.jwt) {
      return false;
    }

    return super.canActivate(context);
  }

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
