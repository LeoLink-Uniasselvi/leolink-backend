import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';
import { AuthenticatedRequest } from '@/modules/auth/types/authenticated-request.interface';

export const GetUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): JwtPayload | undefined => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
