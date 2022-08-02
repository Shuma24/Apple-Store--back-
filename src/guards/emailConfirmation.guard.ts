import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { IRequestWithUser } from 'src/user/interface/requestWithUser.interface';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: IRequestWithUser = context.switchToHttp().getRequest();

    if (request.user?.isEmailConfirmed === true) {
      return true;
    } else {
      throw new UnauthorizedException('Confirm your email first');
    }
  }
}
