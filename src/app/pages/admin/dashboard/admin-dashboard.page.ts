import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import type { AnalyticsKpisDto, OutageNotificationDto } from '../../../core/api/dto/outage.dto';
import { AdminAnalyticsApiService } from '../../../core/api/services/admin-analytics-api.service';
import { AdminNotificationsApiService } from '../../../core/api/services/admin-notifications-api.service';
import { AdminConsoleStore } from '../../../core/state/admin-console.store';
import { OutageStatusService } from '../../../core/state/outage-status.service';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.page.html',
  styleUrl: './admin-dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardPage implements OnInit {
  readonly admin = inject(AdminConsoleStore);
  readonly outageStatus = inject(OutageStatusService);
  readonly analyticsApi = inject(AdminAnalyticsApiService);
  readonly notificationsApi = inject(AdminNotificationsApiService);

  readonly kpis = signal<AnalyticsKpisDto | null>(null);
  readonly notifications = signal<OutageNotificationDto[]>([]);

  readonly unreadNotifications = computed(
    () => this.notifications().filter((n) => !n.readAtUtc).length,
  );

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.outageStatus.refreshAdmin(),
      this.admin.refreshServices(),
      this.admin.refreshUsers(),
      this.loadAnalytics(),
      this.loadNotifications(),
    ]);
  }

  private async loadAnalytics(): Promise<void> {
    try {
      const dto = await firstValueFrom(this.analyticsApi.kpis());
      this.kpis.set(dto);
    } catch {
      this.kpis.set(null);
    }
  }

  private async loadNotifications(): Promise<void> {
    try {
      const list = await firstValueFrom(this.notificationsApi.list());
      this.notifications.set(list);
    } catch {
      this.notifications.set([]);
    }
  }

  formatMttr(): string {
    const v = this.kpis()?.mttrMinutes;
    if (v == null) {
      return '—';
    }
    return `${v.toFixed(0)} min`;
  }
}
