import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { categoryProducts } from '../entity/category.entity';
import { imagesProducts } from '../entity/product-images.entity';
import { State } from '../types/product.constants';
import { ImageDTO } from './image-product.dto';

export class UpdateProductDto {
  @IsString()
  @MinLength(5, {
    message: 'Title is too short',
  })
  @MaxLength(100, {
    message: 'Title is too long',
  })
  @IsOptional()
  title: string;

  @IsArray()
  @Type(() => ImageDTO)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  image: imagesProducts[];

  @IsNumber()
  @IsOptional()
  price: number;

  @IsNumber()
  @IsOptional()
  category: categoryProducts;

  @IsString({ each: true })
  @IsOptional()
  state: State;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  color: string[];

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating: number;

  @IsDate()
  @IsOptional()
  created_at: Date;

  @IsDate()
  @IsOptional()
  updated_at: Date;
}
