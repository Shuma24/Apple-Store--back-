import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class categoryDTO {
  @IsNotEmpty()
  @IsString()
  category: string;
}
