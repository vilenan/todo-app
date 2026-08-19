import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurrentUserType = {
  id: string;
  email: string;
};

export const CurrentUser: () => ParameterDecorator = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserType => {
    const request = ctx.switchToHttp().getRequest<{ user: CurrentUserType }>();
    return request.user;
  },
);
