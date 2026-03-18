import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any, info: any, context: any) {
    if (err || !user) {
      throw err || new UnauthorizedException("Neautorizat");
    }

    const req = context.switchToHttp().getRequest();

    // Rute permise pentru cont neverificat
    const allowedPaths = [
      "/verify/request",
      "/verify/confirm",
    ];

    // Dacă userul NU este verificat, dar ruta NU este una permisă → blocăm
    if (!user.isVerified && !allowedPaths.some(path => req.path.includes(path))) {
      throw new UnauthorizedException("Cont neverificat");
    }

    return user;
  }
}
