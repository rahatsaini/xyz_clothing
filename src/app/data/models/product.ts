import { Price } from './price';

export class Product {
  id!: number;
  name!: string;
  description!: string;
  price!: Price;
  convertedAmountFactor = 1;
  relatedProducts!: number[];
}

