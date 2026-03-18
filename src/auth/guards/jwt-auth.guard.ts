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

    // 🔥 BLOCĂM CONTUL DACĂ NU ESTE VERIFICAT
    if (
      !user.isVerified &&
      req.path !== "/verify/request" &&
      req.path !== "/verify/confirm"
    ) {
      throw new UnauthorizedException("Cont neverificat");
    }

    return user;
  }
}
