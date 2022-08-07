import { Expose } from 'class-transformer';

export class UserRequestDTO {
  @Expose()
  username?: string;

  @Expose()
  created_at?: Date;

  @Expose()
  updated_at?: Date;

  @Expose()
  jwt?: string;

  @Expose()
  status?: number;

  @Expose()
  message?: string;

  @Expose()
  success?: boolean;

  @Expose()
  role?: string;

  @Expose()
  age?: number;

  @Expose()
  phone?: string;

  @Expose()
  email?: string;

  @Expose()
  confirm?: boolean;
}
