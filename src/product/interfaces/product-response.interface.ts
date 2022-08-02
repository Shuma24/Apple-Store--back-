import { Product } from '../entity/product.entity';

export interface IProductResponse {
  products: Product[];
  total: number;
  page: number;
  lastPage: number;
}
