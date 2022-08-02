import { Order, State } from '../types/product.constants';

export interface IProductQueryParams {
  search: string;
  sortBy: string;
  order: Order;
  page: string;
  limit: string;
  category: string;
  state: State;
}
