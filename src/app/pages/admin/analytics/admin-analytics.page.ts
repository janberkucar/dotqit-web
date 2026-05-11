import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import type { AnalyticsKpisDto, DailyCountDto } from '../../../core/api/dto/outage.dto';
import { AdminAnalyticsApiService } from '../../../core/api/services/admin-analytics-api.service';

@Component({
  selector: 'app-admin-analytics-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-analytics.page.html',
  styleUrl: './admin-analytics.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAnalyticsPage implements OnInit {
  private readonly api = inject(AdminAnalyticsApiService);

  readonly kpis = signal<AnalyticsKpisDto | null>(null);

  ngOnInit(): void {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    try {
      const dto = await firstValueFrom(this.api.kpis());
      this.kpis.set(dto);
    } catch {
      this.kpis.set(null);
    }
  }

  sparklinePoints(rows: DailyCountDto[]): string {
    if (!rows.length) {
      return '';
    }
    const max = Math.max(...rows.map((r) => r.resolvedCount), 1);
    const w = 280;
    const h = 72;
    const step = rows.length > 1 ? w / (rows.length - 1) : w;
    return rows
      .map((r, i) => {
        const x = i * step;
        const y = h - (r.resolvedCount / max) * h;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  }
}
