import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../data/models/product';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class ProductService {
  private products: Product[] = [];
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    if (this.products.length > 0) {
      return of( this.products );
    } else {
      return this.http
        .get<Product[]>('http://localhost:4200/assets/products.json')
        .pipe(
          map((data: Product[]) => {
            this.products = data;
            this.products.forEach((x) => (x.convertedAmountFactor = 1));
            return this.products;
          })
        );
    }
  }

  getProduct(id: number): Observable<Product> {
    if (this.products.length > 0) {
      const prd = this.products.filter((x) => x.id === id)[0];
      prd.convertedAmountFactor = 1;
      return of(prd);
    }
    return this.http
      .get<Product[]>('http://localhost:4200/assets/products.json')
      .pipe(
        map((data: Product[]) => {
          const prd = data.filter((x) => x.id === id)[0];
          prd.convertedAmountFactor = 1;
          return prd;
        })
      );
  }

  getRelatedProduct(id: number): Product | undefined{
    const product = this.products.find((x) => x.id === id);
    return product;
  }

  set Products(prd: Product[]) {
    this.products = prd;
  }

  get Products(): Product[] {
    return this.products;
  }
}
