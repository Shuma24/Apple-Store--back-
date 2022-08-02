import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { categoryProducts } from '../entity/category.entity';
import { State } from '../types/product.constants';
import { paramsDTO } from './params-product.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, {
    message: 'Title is too short',
  })
  @MaxLength(100, {
    message: 'Title is too long',
  })
  title: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  category: categoryProducts;

  @IsNotEmpty()
  @IsString({ each: true })
  state: State;

  @Type(() => paramsDTO)
  @IsObject()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  params: paramsDTO;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Type(() => Array)
  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty()
  color: string[];

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  rating: number;

  @IsDate()
  @IsOptional()
  created_at: Date;

  @IsDate()
  @IsOptional()
  updated_at: Date;
}
