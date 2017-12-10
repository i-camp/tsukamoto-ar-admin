import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gauge'
})
export class GaugePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let plusPointPart = Math.round(value.plus / (value.plus + value.minus) * 100) || 0;
    let minusPointPart =  Math.round(value.minus / (value.plus + value.minus) * 100) || 0;
    if (plusPointPart === minusPointPart) {
      plusPointPart = 50;
      minusPointPart = 50;
    }
    return [
      {value: plusPointPart, type: 'info', label: `${plusPointPart}%`},
      {value: minusPointPart, type: 'success', label: `${minusPointPart}%`}
    ];
  }

}
