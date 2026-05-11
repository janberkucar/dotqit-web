import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import type { OutageStatus } from '../../../core/api/dto/outage.dto';
import {
  OUTAGE_SEVERITY_LABELS,
  OUTAGE_STATUS_LABELS,
} from '../../../core/api/dto/outage.dto';
import { OutageStatusService } from '../../../core/state/outage-status.service';
import { PortalSurfaceService } from '../../../core/services/portal-surface.service';
import { outageStatusTone } from '../../../shared/outage/outage-status-color';
import { OutageStatusPipe } from '../../../shared/outage/outage-status.pipe';

@Component({
  selector: 'app-client-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, OutageStatusPipe],
  templateUrl: './client-dashboard.page.html',
  styleUrl: './client-dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDashboardPage implements OnInit, OnDestroy {
  readonly outageStatus = inject(OutageStatusService);
  readonly surface = inject(PortalSurfaceService);
  readonly severityLabels = OUTAGE_SEVERITY_LABELS;
  readonly statusLabels = OUTAGE_STATUS_LABELS;
  readonly outageStatusTone = outageStatusTone;

  readonly postalFilter = signal('');
  readonly areaFilter = signal('');
  readonly statusFilter = signal<OutageStatus | null>(null);

  readonly filteredFeed = this.outageStatus.filterPublicFeed(
    () => this.postalFilter(),
    () => this.areaFilter(),
    () => this.statusFilter(),
  );

  private releasePolling: (() => void) | null = null;

  ngOnInit(): void {
    this.releasePolling = this.outageStatus.beginPublicPolling();
    void this.outageStatus.refreshPublic();
  }

  ngOnDestroy(): void {
    this.releasePolling?.();
  }

  badgeStyle(status: number): string {
    return `var(--status-${outageStatusTone(status)})`;
  }

  onStatusSelect(raw: string): void {
    if (raw === '') {
      this.statusFilter.set(null);
      return;
    }
    this.statusFilter.set(Number.parseInt(raw, 10) as OutageStatus);
  }

  statusFilterSelectValue(): string {
    const v = this.statusFilter();
    return v === null ? '' : `${v}`;
  }
}
