import { IsArray, IsOptional, IsString } from 'class-validator';
import { Product } from '../entity/product.entity';

export class paramsDTO {
  @IsOptional()
  id: number;

  @IsString()
  @IsOptional()
  screen?: string;

  @IsString()
  @IsOptional()
  camera?: string;

  @IsString()
  @IsOptional()
  processor?: string;

  @IsString()
  @IsOptional()
  RAM?: string;

  @IsArray({ each: true })
  @IsOptional()
  memory?: number[];

  @IsString()
  @IsOptional()
  corps?: string;

  @IsString()
  @IsOptional()
  GPS?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsOptional()
  product: Product;
}
