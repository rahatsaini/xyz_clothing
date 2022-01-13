import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/data/models/product';
import { CurrencyService } from 'src/app/services/currency.service';
import { Subscription } from 'rxjs';
import { DEFAULT, DISPLAY_COLUMN_NAMES } from 'src/app/utilities/static';
import { calculateAmount } from 'src/app/utilities/helper';
import { Currency } from 'src/app/data/models/currency';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() dataSource: Product[] = [];
  displayedColumns = DISPLAY_COLUMN_NAMES;
  selectedRates!: Currency;
  private ratesSubscription!: Subscription;
  baseCurrency!: string | null;
  rates: Currency[] = [];
  constructor(private currencyService: CurrencyService) {
    this.getAllExchangeRates();
  }

  ngOnInit(): void {
    this.checkForRateChange();

  }

  getAllExchangeRates(): void {
    this.rates = this.currencyService.ExchangeRates;
  }

  setBaseCurrency(currency: string): void {
    this.baseCurrency = currency !== DEFAULT ? currency : null;
  }

  ngOnDestroy(): void {
    this.ratesSubscription.unsubscribe();
  }

  checkForRateChange(): void {
    this.ratesSubscription = this.currencyService.RatesChangedSubject.subscribe(
      (data) => {
        if (data) {
          this.selectedRates = data;
          const base = this.selectedRates.base ? this.selectedRates.base : data;
          this.setBaseCurrency(base);
          this.calculateAmount(base);
        }
      }
    );
  }

  calculateAmount(rate: string): void {
    this.dataSource.forEach((x) => {
      const factor = calculateAmount(x, this.rates, rate);
      x.convertedAmountFactor = factor ? factor : 1;
    });
  }
}
