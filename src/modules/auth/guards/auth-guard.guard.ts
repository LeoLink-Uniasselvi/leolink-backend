import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '@/modules/auth/decorators/public.decorator';
import { GetSessionByToken } from '@/modules/auth/utils/get-session-by-token';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';
import { AuthenticatedRequest } from '@/modules/auth/types/authenticated-request.interface';
import {
  SessionNotFoundException,
  SessionExpiredException,
  InvalidCredentialsException,
} from '@/modules/auth/exceptions';

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

    // Allow Swagger UI and JSON docs without authentication
    const path = request?.url ?? '';
    if (
      path.startsWith('/docs') ||
      path === '/docs-json' ||
      path.startsWith('/swagger-ui')
    ) {
      return true;
    }
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new InvalidCredentialsException('Token de acesso requerido');
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = payload;

      const session = await this.GetSessionByToken.execute(token);

      if (!session) {
        throw new SessionNotFoundException();
      }

      if (session.revokedAt) {
        throw new SessionNotFoundException();
      }

      if (session.expiresAt && session.expiresAt < new Date()) {
        throw new SessionExpiredException();
      }

      request.session = session;
    } catch (error: unknown) {
      if (
        error instanceof InvalidCredentialsException ||
        error instanceof SessionNotFoundException ||
        error instanceof SessionExpiredException
      ) {
        throw error;
      }
      throw new InvalidCredentialsException('Token inválido');
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
