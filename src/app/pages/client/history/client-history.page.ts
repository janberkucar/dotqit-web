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
import type { AdminOutageListDto } from '../../../core/api/dto/outage.dto';
import { ClientOutagesApiService } from '../../../core/api/services/client-outages-api.service';
import { OutageStatusPipe } from '../../../shared/outage/outage-status.pipe';

@Component({
  selector: 'app-client-history-page',
  standalone: true,
  imports: [CommonModule, RouterLink, OutageStatusPipe],
  templateUrl: './client-history.page.html',
  styleUrl: './client-history.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientHistoryPage implements OnInit {
  private readonly api = inject(ClientOutagesApiService);

  readonly rows = signal<AdminOutageListDto[]>([]);

  ngOnInit(): void {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    try {
      const list = await firstValueFrom(this.api.history());
      this.rows.set(list);
    } catch {
      this.rows.set([]);
    }
  }
}
