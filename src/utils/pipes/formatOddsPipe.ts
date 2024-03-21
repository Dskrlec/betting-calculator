import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatOdds',
  standalone: true,
})
export class FormatOddsPipe implements PipeTransform {

  transform(value: string): string {
    const replacements: { [key: string]: string } = {
      'odds_1': '1',
      'odds_x': 'x',
      'odds_2': '2',
      'odds_12': '12',
      'odds_1x': '1x',
      'odds_x2': 'x2'
    };

    return replacements[value] || value;
  }
}
