import { ProductComponent } from './pages/product/product.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummaryComponent } from './pages/summary/summary.component';

const routes: Routes = [
  { path: 'summary', component: SummaryComponent},
  { path: '', component: SummaryComponent},
  { path: 'product/:id', component: ProductComponent},
  { path: '*', redirectTo: '/summary'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
