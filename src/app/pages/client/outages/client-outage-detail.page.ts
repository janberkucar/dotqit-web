import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OUTAGE_SEVERITY_LABELS } from '../../../core/api/dto/outage.dto';
import { AuthService } from '../../../core/services/auth.service';
import { OutageReportsStore } from '../../../core/state/outage-reports.store';
import { outageStatusTone } from '../../../shared/outage/outage-status-color';
import { OutageStatusPipe } from '../../../shared/outage/outage-status.pipe';

@Component({
  selector: 'app-client-outage-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, OutageStatusPipe],
  templateUrl: './client-outage-detail.page.html',
  styleUrl: './client-outage-detail.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientOutageDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly outages = inject(OutageReportsStore);
  readonly auth = inject(AuthService);
  readonly severityLabels = OUTAGE_SEVERITY_LABELS;
  readonly outageStatusTone = outageStatusTone;

  readonly viewerId = computed(() => {
    const session = this.auth.session();
    const raw = session?.user.id;
    return raw ? Number.parseInt(raw, 10) : Number.NaN;
  });

  ngOnInit(): void {
    const raw = this.route.snapshot.paramMap.get('id');
    const id = raw ? Number.parseInt(raw, 10) : NaN;
    if (!Number.isFinite(id)) {
      return;
    }
    void this.outages.loadDetail(id, 'client');
  }

  isReporter(): boolean {
    const detail = this.outages.detail();
    if (!detail?.reporterUserId) {
      return false;
    }
    return Number.isFinite(this.viewerId()) && this.viewerId() === detail.reporterUserId;
  }

  badgeStyle(status: number): string {
    return `var(--status-${outageStatusTone(status)})`;
  }
}
