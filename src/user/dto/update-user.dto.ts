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

export class UpdateUserDTO {
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

  @IsPhoneNumber('UA')
  @IsOptional()
  phone: 'string';
}
