import { AbstractControl } from '@angular/forms';

export class CustomValidators {
  constructor() {}
  static unique(arr: number[], originalVal: number): any {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const id = control.value;
      if (arr.includes(Number(id)) && originalVal !== Number(id)) {
        return { unique: true };
      } else {
        return null;
      }
    };
  }
}
