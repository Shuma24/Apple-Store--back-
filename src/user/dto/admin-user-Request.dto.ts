import { Expose } from 'class-transformer';
import { Role } from '../enums/user-roles.enum';

export class AdminRequestUserDTO {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  age: number;

  @Expose()
  role: Role;

  @Expose()
  phone: 'string';

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  isEmailConfirmed: boolean;
}
