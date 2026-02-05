import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const { userId, refreshToken } = req.body;

    if (!userId || !refreshToken) {
      throw new UnauthorizedException('Missing refresh token data');
    }

    return true;
  }
}
