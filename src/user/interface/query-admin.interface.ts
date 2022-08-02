import { Order } from 'src/product/types/product.constants';

export interface IQueryAdmin {
  search: string;
  sortBy: string;
  order: Order;
  page: string;
  limit: string;
}
