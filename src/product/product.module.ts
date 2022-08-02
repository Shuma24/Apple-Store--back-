import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { categoryProducts } from './entity/category.entity';
import { imagesProducts } from './entity/product-images.entity';
import { paramsProducts } from './entity/product-params.entity';

import { Product } from './entity/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      categoryProducts,
      imagesProducts,
      paramsProducts,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
