import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { RoleGuard } from 'src/guards/role.guard';
import { Role } from 'src/user/enums/user-roles.enum';
import { DeleteResult } from 'typeorm';
import { categoryDTO } from './dto/category-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ImageDTO } from './dto/image-product.dto';
import { paramsDTO } from './dto/params-product.dto';

import { UpdateProductDto } from './dto/update-product.dto';
import { categoryProducts } from './entity/category.entity';
import { imagesProducts } from './entity/product-images.entity';
import { Product } from './entity/product.entity';
import { checkImgFile } from './function/file-filter';

import { IProductQueryParams } from './interfaces/product-queryparams.interface';
import { IProductResponse } from './interfaces/product-response.interface';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly _productService: ProductService) {}

  @HttpCode(201)
  @Post('create')
  @UseGuards(RoleGuard(Role.Admin))
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'file', maxCount: 5 }], {
      fileFilter: checkImgFile,
    }),
  )
  async createProduct(
    @Body() dto: CreateProductDto,
    @UploadedFiles()
    files: {
      file: Express.Multer.File[];
      data: CreateProductDto;
    },
  ) {
    const product = await this._productService.create(dto, files.file);
    return product;
  }

  @HttpCode(201)
  @Post('admin/category-create')
  @UseGuards(RoleGuard(Role.Admin))
  async createCategory(@Body() dto: categoryDTO): Promise<categoryProducts> {
    return await this._productService.createProductCategory(dto);
  }

  @HttpCode(200)
  @Delete('delete/:id')
  @UseGuards(RoleGuard(Role.Admin))
  async deleteProduct(
    @Param('id') id: string,
  ): Promise<HttpException | DeleteResult> {
    return await this._productService.delete(id);
  }

  @HttpCode(200)
  @Put('update/params/:id')
  @UseGuards(RoleGuard(Role.Admin))
  async updateParamsProduct(
    @Param('id') id: string,
    @Body() dto: paramsDTO,
  ): Promise<Product | HttpException> {
    return this._productService.updateProductParams(id, dto);
  }

  @HttpCode(200)
  @Put('update/:id')
  @UseGuards(RoleGuard(Role.Admin))
  async updateProductGeneral(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<Product | HttpException> {
    return await this._productService.updateGeneralProduct(id, dto);
  }

  @HttpCode(200)
  @Get('update/image/:id')
  @UseGuards(RoleGuard(Role.Admin))
  async updatePhoto(
    @Param('id') id: string,
    @Body() dto: ImageDTO,
  ): Promise<
    | HttpException
    | ({
        id: number;
        url: string;
      } & imagesProducts)[]
  > {
    return await this._productService.updateImages(id, dto);
  }

  @HttpCode(200)
  @Get('all')
  async getProducts(
    @Query() query: IProductQueryParams,
  ): Promise<HttpException | IProductResponse> {
    return await this._productService.getAll(query);
  }

  @HttpCode(200)
  @Get(':id')
  async getOneProduct(
    @Param('id') id: string,
  ): Promise<HttpException | Product> {
    return await this._productService.getOne(id);
  }
}
