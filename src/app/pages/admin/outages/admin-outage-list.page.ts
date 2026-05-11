import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  OUTAGE_SEVERITY_LABELS,
  OUTAGE_SOURCE_LABELS,
} from '../../../core/api/dto/outage.dto';
import { OutageStatusService } from '../../../core/state/outage-status.service';
import { outageStatusTone } from '../../../shared/outage/outage-status-color';
import { OutageStatusPipe } from '../../../shared/outage/outage-status.pipe';

@Component({
  selector: 'app-admin-outage-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, OutageStatusPipe],
  templateUrl: './admin-outage-list.page.html',
  styleUrl: './admin-outage-list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOutageListPage implements OnInit {
  readonly outageStatus = inject(OutageStatusService);
  readonly severityLabels = OUTAGE_SEVERITY_LABELS;
  readonly sourceLabels = OUTAGE_SOURCE_LABELS;
  readonly outageStatusTone = outageStatusTone;

  ngOnInit(): void {
    void this.outageStatus.refreshAdmin();
  }

  badgeStyle(status: number): string {
    return `var(--status-${outageStatusTone(status)})`;
  }
}
