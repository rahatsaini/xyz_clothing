import { Component, OnInit } from '@angular/core';
import { Currency } from '../data/models/currency';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  selectedRates: any = 'default';
  constructor(private currencyService: CurrencyService) { }

  exchangeRates: Currency[] = [];

  ngOnInit(): void {
    this.getRates();
  }

  getRates(): void{
    this.exchangeRates = this.currencyService.ExchangeRates;
  }

  ratesChanged(): void{
    this.currencyService.setRatesChangedSubject(this.selectedRates);
  }

}
