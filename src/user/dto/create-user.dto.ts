import {
  IsEmail,
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

export class CreateUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  @IsString()
  username: string;

  @IsNumber()
  @Min(12)
  @Max(100)
  @IsOptional()
  age: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsPhoneNumber('UA')
  @IsNotEmpty()
  phone: 'string';
}
