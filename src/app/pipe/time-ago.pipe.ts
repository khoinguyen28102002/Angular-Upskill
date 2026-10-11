import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string | number): string {
    const timestamp = new Date(value).getTime();
    if (Number.isNaN(timestamp)) return '';

    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    if (elapsedSeconds < 60) return 'just now';

    const units: [number, string][] = [
      [60 * 60 * 24 * 365, 'y'],
      [60 * 60 * 24 * 30, 'mo'],
      [60 * 60 * 24, 'd'],
      [60 * 60, 'h'],
      [60, 'm']
    ];

    const [unitSeconds, unitLabel] = units.find(([seconds]) => elapsedSeconds >= seconds)!;
    return `${Math.floor(elapsedSeconds / unitSeconds)}${unitLabel} ago`;
  }
}