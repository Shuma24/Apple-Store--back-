import {
  Allow,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Product } from '../entity/product.entity';

export class ImageDTO {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  key: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsOptional()
  product: Product;
}
