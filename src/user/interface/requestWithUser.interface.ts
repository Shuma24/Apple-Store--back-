import { Request } from 'express';

import { User } from '../entity/user.entity';

export interface IRequestWithUser extends Request {
  user: User;
}
