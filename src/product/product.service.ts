import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { DeleteResult, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { categoryDTO } from './dto/category-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ImageDTO } from './dto/image-product.dto';
import { paramsDTO } from './dto/params-product.dto';

import { UpdateProductDto } from './dto/update-product.dto';
import { categoryProducts } from './entity/category.entity';
import { imagesProducts } from './entity/product-images.entity';
import { Product } from './entity/product.entity';
import {
  IMAGE_NOT_FOUND,
  PRODUTCT_NOT_FOUND,
} from './errors/prouct-error.constants';
import { IProductQueryParams } from './interfaces/product-queryparams.interface';
import { IProductResponse } from './interfaces/product-response.interface';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly _productRepository: Repository<Product>,
    @InjectRepository(categoryProducts)
    private readonly _categoryRepository: Repository<categoryProducts>,
    @InjectRepository(imagesProducts)
    private readonly _imageRepository: Repository<imagesProducts>,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateProductDto, files: Express.Multer.File[]) {
    try {
      const createProduct = this._productRepository.create(dto);
      const product = await this._productRepository.save(createProduct);
      const imgs = await this.createImg(files, product);

      product.image = imgs;

      return product;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return new HttpException(`${err.message}`, HttpStatus.NOT_FOUND);
      }
    }
  }

  async createProductCategory(dto: categoryDTO): Promise<categoryProducts> {
    const category = this._categoryRepository.create(dto);

    return await this._categoryRepository.save(category);
  }

  async createImg(files: Express.Multer.File[], product: Product) {
    const s3 = new S3();

    const upload = await Promise.all(
      files.map(async (item) =>
        s3
          .upload({
            Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
            Body: item.buffer,
            Key: `${uuid()}-${item.originalname}`,
          })
          .promise(),
      ),
    );

    const imgSave = upload.map((values) => {
      return this._imageRepository.create({
        key: values.Key,
        url: values.Location,
        product: { id: product.id },
      });
    });

    return await this._imageRepository.save(imgSave);
  }

  async updateProductParams(
    id: string,
    dto: paramsDTO,
  ): Promise<Product | HttpException> {
    try {
      if (!id) {
        return null;
      }

      const product = await this._productRepository.findOne({
        where: { id: parseInt(id) },
      });

      if (!product) {
        throw new HttpException(`${PRODUTCT_NOT_FOUND}`, HttpStatus.NOT_FOUND);
      }

      dto.id = product.id;

      Object.assign(product.params, dto);

      return this._productRepository.save(product);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return new HttpException(`${err.message}`, HttpStatus.NOT_FOUND);
      }
    }
  }

  async updateGeneralProduct(
    id: string,
    dto: UpdateProductDto,
  ): Promise<Product | HttpException> {
    try {
      if (!id) {
        return null;
      }

      const product = await this._productRepository.findOne({
        where: { id: parseInt(id) },
        relations: { image: true, params: true, category: true },
      });

      if (!product) {
        throw new HttpException(`${PRODUTCT_NOT_FOUND}`, HttpStatus.NOT_FOUND);
      }

      Object.assign(product, dto);

      return this._productRepository.save(product);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return new HttpException(`${err.message}`, HttpStatus.NOT_FOUND);
      }
    }
  }

  async updateImages(
    id: string,
    dto: ImageDTO,
  ): Promise<
    | HttpException
    | ({
        id: number;
        url: string;
      } & imagesProducts)[]
  > {
    try {
      const images = await this._imageRepository.find();

      const ids = images.filter((el) => el.id === +id);

      if (ids) {
        const update = ids.map((obj) => ({ id: obj.id, url: dto.url }));

        return await this._imageRepository.save(update);
      }

      return new HttpException(`${IMAGE_NOT_FOUND}`, HttpStatus.NOT_FOUND);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return new HttpException(`${err.message}`, HttpStatus.NOT_FOUND);
      }
    }
  }

  async delete(id: string): Promise<DeleteResult | HttpException> {
    try {
      const product = await this._productRepository.findOne({
        where: { id: parseInt(id) },
      });
      if (!product) {
        throw new HttpException(`${PRODUTCT_NOT_FOUND}`, HttpStatus.NOT_FOUND);
      }
      return await this._productRepository.delete({ id: product.id });
    } catch (err: unknown) {
      if (err instanceof Error) {
        return new HttpException(`${err.message}`, HttpStatus.NOT_FOUND);
      }
    }
  }

  async getAll(
    query: IProductQueryParams,
  ): Promise<HttpException | IProductResponse> {
    try {
      const queryBuilder = this._productRepository
        .createQueryBuilder()
        .leftJoinAndSelect('Product.image', 'images_product')
        .leftJoinAndSelect('Product.category', 'category_products')
        .leftJoinAndSelect('Product.params', 'params_products');

      if (query.search) {
        queryBuilder.where(
          'LOWER(title) LIKE :search OR LOWER(description) LIKE :search',
          {
            search: `%${query.search.toLowerCase()}%`,
          },
        );
      }

      if (query.sortBy) {
        queryBuilder.orderBy(
          `${query.sortBy}`,
          query.order.toUpperCase() as any,
        );
      }

      if (query.category) {
        queryBuilder.andWhere('category = :category', {
          category: query.category,
        });
      }

      if (query.state) {
        queryBuilder.andWhere('state = :state', {
          state: query.state,
        });
      }

      const page: number = parseInt(query.page) || 1;
      const total = await queryBuilder.getCount();
      const perPage = +query.limit || 5;
      queryBuilder.offset((page - 1) * perPage).limit(perPage);
      const lastPage = Math.ceil(total / perPage);

      const products = await queryBuilder.getMany();

      return { products, total, page, lastPage };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return new HttpException(`${err.message}`, HttpStatus.NOT_FOUND);
      }
    }
  }

  async getOne(id: string): Promise<HttpException | Product> {
    try {
      if (!id) {
        return null;
      }
      const product = await this._productRepository.findOne({
        where: { id: +id },
      });
      if (!product) {
        throw new HttpException(`${PRODUTCT_NOT_FOUND}`, HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return new HttpException(`${err.message}`, HttpStatus.NOT_FOUND);
      }
    }
  }
}
