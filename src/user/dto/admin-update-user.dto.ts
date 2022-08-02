import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Role } from '../enums/user-roles.enum';

export class AdminUpdateUserDTO {
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  @IsString()
  @IsOptional()
  username: string;

  @IsNumber()
  @Min(12)
  @Max(100)
  @IsOptional()
  age: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @IsOptional()
  password: string;

  @IsEnum(Role)
  @IsNotEmpty()
  @IsOptional()
  role: Role;

  @IsPhoneNumber('UA')
  @IsNotEmpty()
  @IsOptional()
  phone: 'string';
}
