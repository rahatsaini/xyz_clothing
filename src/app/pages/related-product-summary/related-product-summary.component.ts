import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { Product } from 'src/app/data/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-related-product-summary',
  templateUrl: './related-product-summary.component.html',
  styleUrls: ['./related-product-summary.component.css'],
})
export class RelatedProductSummaryComponent implements OnInit {
  @Input() events!: Observable<Product[]>;
  dataSource: Product[] = [];
  constructor() {}

  ngOnInit(): void {
    this.getRelatedProducts();
  }

  getRelatedProducts(): void {
    this.events.subscribe((data: Product[]) => {
      this.dataSource = data;
    });
  }
}
