import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { OUTAGE_SEVERITY_LABELS } from '../../../core/api/dto/outage.dto';
import { OutageStatusService } from '../../../core/state/outage-status.service';
import { outageStatusTone } from '../../../shared/outage/outage-status-color';
import { OutageStatusPipe } from '../../../shared/outage/outage-status.pipe';

@Component({
  selector: 'app-client-outage-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, OutageStatusPipe],
  templateUrl: './client-outage-list.page.html',
  styleUrl: './client-outage-list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientOutageListPage implements OnInit, OnDestroy {
  readonly outageStatus = inject(OutageStatusService);
  readonly severityLabels = OUTAGE_SEVERITY_LABELS;
  readonly outageStatusTone = outageStatusTone;

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
}
