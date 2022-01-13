

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableComponent } from './shared/table/table.component';
import { SummaryComponent } from './pages/summary/summary.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { ProductService } from './services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { ProductComponent } from './pages/product/product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RelatedProductSummaryComponent } from './pages/related-product-summary/related-product-summary.component';
import { HeaderComponent } from './header/header.component';
import { CurrencyService } from './services/currency.service';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    SummaryComponent,
    ProductComponent,
    RelatedProductSummaryComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    ProductService,
    CurrencyService,
    {
      provide: APP_INITIALIZER,
      useFactory: StartupServiceFactory,
      deps: [ CurrencyService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})


export class AppModule { }

export function StartupServiceFactory(currencyService: CurrencyService) {
  return () => currencyService.load();
}
