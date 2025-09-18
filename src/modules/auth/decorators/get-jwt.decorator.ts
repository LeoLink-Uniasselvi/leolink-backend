import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '@/modules/auth/types/authenticated-request.interface';

export const GetJwt = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;

    if (!authorization || Array.isArray(authorization)) {
      return undefined;
    }

    const parts = authorization.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return undefined;
    }

    return parts[1];
  },
);
