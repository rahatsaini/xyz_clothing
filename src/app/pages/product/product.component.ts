import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/data/models/product';
import { ProductService } from 'src/app/services/product.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { calculateAmount } from 'src/app/utilities/helper';
import { Currency } from 'src/app/data/models/currency';
import { CurrencyService } from 'src/app/services/currency.service';
import { BASE_CURRENCY } from 'src/app/utilities/static';
import { CustomValidators } from 'src/app/shared/custom.validators';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  productID!: number;
  product!: Product;
  productForm: FormGroup = new FormGroup({});
  isLoading = true;
  allProductsID: number[] = [];
  products: Product[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA]; // From Material
  relatedProduct: Product[] = [];
  @ViewChild('relatedProductInput')
  relatedProductInput!: ElementRef<HTMLInputElement>;
  private ratesSubscription!: Subscription;
  selectedRates!: Currency;
  baseCurrencyValues = [
    BASE_CURRENCY.AUD,
    BASE_CURRENCY.CNY,
    BASE_CURRENCY.USD,
  ];
  selectedBaseCurrency!: string;
  rates: Currency[] = [];
  eventsSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(
    []
  );
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private currencyService: CurrencyService
  ) {
    this.getAllProducts();
    this.getAllExchangeRates();
  }

  ngOnInit(): void {
    this.getProductIDFromURL();
    this.checkForRateChange();

  }

  ngOnDestroy(): void {
    this.ratesSubscription.unsubscribe();
  }

  getProductIDFromURL(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.productID = Number(routeParams.get('id'));
    this.checkForValidProductID(this.productID);
    this.getProductDetails(this.productID);
  }

  checkForValidProductID(id: number): void {
    const validID = this.products.some((x) => x.id === id);
    if (!validID) {
      this.router.navigate(['summary']);
    }
  }

  getAllExchangeRates(): void {
    this.rates = this.currencyService.ExchangeRates;
    debugger
  }

  checkForRateChange(): void {
    this.ratesSubscription = this.currencyService.RatesChangedSubject.subscribe(
      (data) => {
        if (data) {
          this.selectedRates = data;
          this.selectedRates.base;
          const base = this.selectedRates.base ? this.selectedRates.base : data;
          this.calculateAmount(base);
          this.productForm.controls.base.setValue(base);
          this.productForm.controls.amount.setValue(
            this.product.price.amount * this.product.convertedAmountFactor
          );
          debugger
        }
      }
    );
  }

  calculateAmount(rate: string): void {
    const factor = calculateAmount(this.product, this.rates, rate);
    this.product.convertedAmountFactor = factor ? factor : 1;
  }

  getProductDetails(id: number): void {
    this.isLoading = true;
    this.productService.getProduct(id).subscribe(
      (data: Product) => {
        this.product = data;
      },
      () => {
        //if error
      },
      () => {
        this.setForm();
        this.getRelatedProducts();
        this.isLoading = false;
      }
    );
  }

  getAllProducts(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.allProductsID = this.products.map((x) => x.id);
    });
  }

  getRelatedProducts(): void {
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.relatedProduct = data.filter((x) => {
          return this.product.relatedProducts.includes(x.id);
        });
      },
      () => {
        //if error
      },
      () => {
        this.eventsSubject.next(this.relatedProduct);
      }
    );
  }

  setForm(): void {
    this.productForm = this.fb.group({
      productId: new FormControl(this.product.id, [
        Validators.required,
        CustomValidators.unique(this.allProductsID, this.product.id),
      ]),
      productName: new FormControl(this.product.name, [
        Validators.required,
        Validators.minLength(3),
      ]),
      description: new FormControl(this.product.description),
      base: new FormControl(this.product.price.base, [Validators.required]),
      amount: new FormControl(this.product.price.amount, [Validators.required]),
      relatedProds: new FormControl(),
    });
  }

  saveProduct(): void {
    const index = this.products.findIndex((x) => x.id === this.product.id);
    this.products[index].id = this.productForm.controls.productId.value;
    this.products[index].name = this.productForm.controls.productName.value;
    this.products[index].description =
      this.productForm.controls.description.value;
    this.products[index].price.amount = this.productForm.controls.amount.value;
    this.products[index].price.base = this.productForm.controls.base.value;
    this.products[index].relatedProducts = this.product.relatedProducts;
    this.productService.Products = this.products;
    this.eventsSubject.next(this.relatedProduct);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const newRelatedProduct = this.products.find((x) => x.name === value);
    if (newRelatedProduct) {
      this.relatedProduct.push(newRelatedProduct);
      this.product.relatedProducts.push(newRelatedProduct.id);
    }
  }

  remove(product: Product): void {
    this.relatedProduct = this.relatedProduct.filter((x) => x !== product);
    this.product.relatedProducts = this.relatedProduct.map((x) => x.id);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const newRelatedProduct = this.products.find(
      (x) => x.id === event.option.value
    );
    if (newRelatedProduct) {
      this.relatedProduct.push(newRelatedProduct);
      this.product.relatedProducts.push(newRelatedProduct.id);
    }
    this.relatedProductInput.nativeElement.value = '';
  }

  relatedProductCheck(product: Product): boolean {
    const isDuplicate = this.relatedProduct.some((x) => x.id === product.id);
    return isDuplicate;
  }
}
