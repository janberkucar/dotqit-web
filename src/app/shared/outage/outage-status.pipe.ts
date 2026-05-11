import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../../core/language/language.service';

@Pipe({
  name: 'outageStatus',
  standalone: true,
})
export class OutageStatusPipe implements PipeTransform {
  private readonly lang = inject(LanguageService);

  transform(value: number | string | null | undefined): string {
    const parsed =
      typeof value === 'string'
        ? Number.parseInt(value, 10)
        : value ?? Number.NaN;

    if (!Number.isFinite(parsed)) {
      return this.lang.t('outage.status.unknown');
    }

    const key = `outage.status.${parsed}`;
    const resolved = this.lang.t(key);
    return resolved === key ? this.lang.t('outage.status.unknown') : resolved;
  }
}
