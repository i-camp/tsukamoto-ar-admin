import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'score'
})
export class ScorePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // スコア増幅率: 値が大きいほど一回当たりのcommitで獲得されるスコアが大きくなる
    const amplifier = 100;
    // 比率の重み: 値が大きいほど、総ポイント数よりPlusとMinusの比率がスコアに反映される
    const balanceWeighting = 5;

    // plus, minusのどちらかにしか点が入っていない場合はscoreは0
    if (value.plus === 0 || value.minus === 0) {
      return 0;
    }

    // 基礎スコア: 総ポイントが高いほど上昇
    const baseScore = (value.plus + value.minus) * amplifier;
    // 乗数: plusとminusの比率が1:1に近いほど1に近付く
    const multiplier = Math.pow(Math.min(value.plus / value.minus, value.minus / value.plus), balanceWeighting);
    // 最終スコア: 基礎スコアに乗数をかけたもの
    return Math.round(baseScore * multiplier);
  }

}
