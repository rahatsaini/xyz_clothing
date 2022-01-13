# XyzClothing

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.14.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Summary

The app showcases list of products and their related products. Users can navigate to a particular product and edit it.
App have 2 pages, summary and product page. User can navigate to any product page using id of the product. For example tp view product with id 3, navigate to http://localhost:4200/product/3
If use tries to navigate to a product that does not exists, they will be navigated to the summary page.


## Read Write operations

The app is reading from static Json file. Once the data is read, it is stored in the cache. Any updates are done in the cache.
The app does not write to the file system. All the changes remain the cache and when reloaded and the changes are lost.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
