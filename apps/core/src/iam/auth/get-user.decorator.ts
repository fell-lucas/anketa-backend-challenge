import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from './auth.request';
import { UserJwt } from './user.jwt';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserJwt => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    return request.user;
  },
);
