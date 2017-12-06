import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gauge'
})
export class GaugePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let plusPointPart = value.plusPoint / (value.plusPoint + value.minusPoint) * 100 || 0;
    let minusPointPart = value.minusPoint / (value.plusPoint + value.minusPoint) * 100 || 0;
    if (plusPointPart === minusPointPart) {
      plusPointPart = 50;
      minusPointPart = 50;
    }
    return [
      {value: plusPointPart, label: 'Testing'},
      {value: minusPointPart, label: 'SpeedUp'}
    ];
  }

}
