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
import type { OutageNotificationDto } from '../../../core/api/dto/outage.dto';
import { AdminNotificationsApiService } from '../../../core/api/services/admin-notifications-api.service';

@Component({
  selector: 'app-admin-notifications-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-notifications.page.html',
  styleUrl: './admin-notifications.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminNotificationsPage implements OnInit {
  private readonly api = inject(AdminNotificationsApiService);

  readonly rows = signal<OutageNotificationDto[]>([]);

  ngOnInit(): void {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    try {
      const list = await firstValueFrom(this.api.list());
      this.rows.set(list);
    } catch {
      this.rows.set([]);
    }
  }

  async markRead(id: number): Promise<void> {
    try {
      await firstValueFrom(this.api.markRead(id));
      await this.refresh();
    } catch {
      /* noop */
    }
  }
}
