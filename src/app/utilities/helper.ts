import { DEFAULT } from './static';

export function  calculateAmount(product: any, rates: any[], rate: string): number{

      if(product.price.base !== rate)
      {
        const convertedAmountFactor = rate === DEFAULT ? 1 : rates.find( r => r.base === product.price.base)?.rates[rate];
        return convertedAmountFactor;
      }
      else
      {
        return 1;
      }
    }

