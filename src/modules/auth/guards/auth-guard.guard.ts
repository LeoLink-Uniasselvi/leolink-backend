import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '@/modules/auth/decorators/public.decorator';
import { GetSessionByToken } from '@/modules/auth/utils/get-session-by-token';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';
import { AuthenticatedRequest } from '@/modules/auth/types/authenticated-request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @Inject(GetSessionByToken)
    private GetSessionByToken: GetSessionByToken,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = payload;

      const session = await this.GetSessionByToken.execute(token);

      if (!session) {
        throw new UnauthorizedException('Session not found');
      }

      if (session.revokedAt) {
        throw new UnauthorizedException('Session has been revoked');
      }

      if (session.expiresAt && session.expiresAt < new Date()) {
        throw new UnauthorizedException('Token has expired');
      }

      request.session = session;
    } catch (error: unknown) {
      throw new UnauthorizedException((error as Error).message);
    }
    return true;
  }

  private extractTokenFromHeader(
    request: AuthenticatedRequest,
  ): string | undefined {
    const authorization = request.headers.authorization;
    if (!authorization || Array.isArray(authorization)) {
      return undefined;
    }
    const [type, token] = authorization.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
