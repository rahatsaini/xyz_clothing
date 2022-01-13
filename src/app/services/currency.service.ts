import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { Currency } from '../data/models/currency';
import { DEFAULT } from '../utilities/static';


@Injectable()
export class CurrencyService {

  /**
   *
   */
   private exchangeRates: Currency[] = [];
   private ratesChangedSubject = new BehaviorSubject<any>('');
   constructor(private http: HttpClient) {
     this.getCurrencyConversionData();
   }

   getCurrencyConversionData(): Observable<Currency[]>{
    return this.http.get<Currency[]>('http://localhost:4200/assets/exchange_rates.json');
   }

   get ExchangeRates(): Currency[]{
     return this.exchangeRates;
   }

   get RatesChangedSubject(): Observable<any>{
     return this.ratesChangedSubject.asObservable();
   }

   setRatesChangedSubject(data: any): void{
     this.ratesChangedSubject.next(data);
   }

   load(): Promise<any> {
    return this.getCurrencyConversionData()
    .toPromise()
    .then(
      data => {
        this.exchangeRates = data;
      }
    );
  }


}
