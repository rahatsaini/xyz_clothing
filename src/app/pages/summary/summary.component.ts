import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/data/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  dataSource: Product[] = [];
  isLoading = true;
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(): void{
    this.isLoading = true;
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.dataSource = data;
      },
      () => {},
      () => {
        this.isLoading = false;
      }
    );
  }
}
