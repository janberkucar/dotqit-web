import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  OUTAGE_SEVERITY_LABELS,
  OUTAGE_STATUS_LABELS,
  OUTAGE_TYPE_LABELS,
} from '../../../core/api/dto/outage.dto';
import { AdminConsoleStore } from '../../../core/state/admin-console.store';
import { OutageReportsStore } from '../../../core/state/outage-reports.store';
import { outageStatusTone } from '../../../shared/outage/outage-status-color';
import { OutageStatusPipe } from '../../../shared/outage/outage-status.pipe';

@Component({
  selector: 'app-admin-outage-edit-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, OutageStatusPipe],
  templateUrl: './admin-outage-edit.page.html',
  styleUrl: './admin-outage-edit.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOutageEditPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly outages = inject(OutageReportsStore);
  readonly admin = inject(AdminConsoleStore);

  readonly severityLabels = OUTAGE_SEVERITY_LABELS;
  readonly statusLabels = OUTAGE_STATUS_LABELS;
  readonly typeLabels = OUTAGE_TYPE_LABELS;
  readonly outageStatusTone = outageStatusTone;

  outageId = 0;

  title = '';
  description = '';
  publicMessage = '';
  outageType = 0;
  severity = 1;
  status = 0;
  startedAtUtc = '';
  resolvedAtUtc = '';
  estimatedRestorationUtc = '';
  postalCode = '';
  areaLabel = '';
  street = '';
  assignedCrew = '';
  /** Mirrors server flag; use Publish buttons to toggle with audit trail. */
  isPublishedFlag = false;

  readonly selectedServiceIds = signal<number[]>([]);
  timelineMessage = '';

  async ngOnInit(): Promise<void> {
    const raw = this.route.snapshot.paramMap.get('id');
    this.outageId = raw ? Number.parseInt(raw, 10) : NaN;
    if (!Number.isFinite(this.outageId)) {
      return;
    }

    await Promise.all([
      this.admin.refreshServices(),
      this.outages.loadDetail(this.outageId, 'admin'),
    ]);

    const detail = this.outages.detail();
    if (!detail) {
      return;
    }

    this.title = detail.title;
    this.description = detail.description;
    this.publicMessage = detail.publicMessage;
    this.outageType = detail.outageType;
    this.severity = detail.severity;
    this.status = detail.status;
    this.startedAtUtc = detail.startedAtUtc;
    this.resolvedAtUtc = detail.resolvedAtUtc ?? '';
    this.estimatedRestorationUtc = detail.estimatedRestorationUtc ?? '';
    this.postalCode = detail.postalCode ?? '';
    this.areaLabel = detail.areaLabel ?? '';
    this.street = detail.street ?? '';
    this.assignedCrew = detail.assignedCrew ?? '';
    this.isPublishedFlag = detail.isPublished;
    this.selectedServiceIds.set(detail.affectedServices.map((s) => s.id));
  }

  toggleService(id: number): void {
    const cur = this.selectedServiceIds();
    if (cur.includes(id)) {
      this.selectedServiceIds.set(cur.filter((x) => x !== id));
    } else {
      this.selectedServiceIds.set([...cur, id]);
    }
  }

  isSelected(id: number): boolean {
    return this.selectedServiceIds().includes(id);
  }

  badgeStyle(status: number): string {
    return `var(--status-${outageStatusTone(status)})`;
  }

  async save(): Promise<void> {
    const resolved =
      this.resolvedAtUtc.trim().length > 0 ? this.resolvedAtUtc.trim() : null;
    const eta =
      this.estimatedRestorationUtc.trim().length > 0
        ? this.estimatedRestorationUtc.trim()
        : null;

    await this.outages.update(this.outageId, {
      title: this.title.trim(),
      description: this.description.trim(),
      publicMessage: this.publicMessage.trim(),
      outageType: this.outageType as 0 | 1 | 2 | 3 | 4,
      severity: this.severity as 0 | 1 | 2 | 3,
      status: this.status as 0 | 1 | 2 | 3 | 4 | 5,
      startedAtUtc: this.startedAtUtc,
      resolvedAtUtc: resolved,
      estimatedRestorationUtc: eta,
      postalCode: this.postalCode.trim() || null,
      areaLabel: this.areaLabel.trim() || null,
      street: this.street.trim() || null,
      assignedCrew: this.assignedCrew.trim(),
      isPublished: this.isPublishedFlag,
      affectedServiceIds: this.selectedServiceIds(),
    });

    const refreshed = this.outages.detail();
    if (refreshed) {
      this.isPublishedFlag = refreshed.isPublished;
    }
  }

  async setPublished(published: boolean): Promise<void> {
    if (await this.outages.publish(this.outageId, published)) {
      const refreshed = this.outages.detail();
      if (refreshed) {
        this.isPublishedFlag = refreshed.isPublished;
      }
    }
  }

  async remove(): Promise<void> {
    if (await this.outages.remove(this.outageId)) {
      void this.router.navigate(['/admin/outages']);
    }
  }

  async addUpdate(): Promise<void> {
    const msg = this.timelineMessage.trim();
    if (!msg) {
      return;
    }
    if (await this.outages.addTimelineUpdate(this.outageId, msg)) {
      this.timelineMessage = '';
    }
  }
}
