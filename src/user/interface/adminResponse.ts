import { User } from '../entity/user.entity';

export interface IAdminResponse {
  users: User[];
  total: number;
  page: number;
  lastPage: number;
}
