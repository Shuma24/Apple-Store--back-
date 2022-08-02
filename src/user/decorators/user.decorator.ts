import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestWithUser } from '../interface/requestWithUser.interface';

export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<IRequestWithUser>();

    const user = request.user;

    return data ? user?.[data] : user;
  },
);
