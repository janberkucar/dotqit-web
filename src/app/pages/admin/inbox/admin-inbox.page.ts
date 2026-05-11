import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { OUTAGE_SOURCE_LABELS } from '../../../core/api/dto/outage.dto';
import { OutageStatusService } from '../../../core/state/outage-status.service';
import { OutageStatusPipe } from '../../../shared/outage/outage-status.pipe';

@Component({
  selector: 'app-admin-inbox-page',
  standalone: true,
  imports: [CommonModule, RouterLink, OutageStatusPipe],
  templateUrl: './admin-inbox.page.html',
  styleUrl: './admin-inbox.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminInboxPage implements OnInit {
  readonly outageStatus = inject(OutageStatusService);
  readonly sourceLabels = OUTAGE_SOURCE_LABELS;

  readonly drafts = computed(() =>
    this.outageStatus.adminList().filter((r) => !r.isPublished),
  );

  ngOnInit(): void {
    void this.outageStatus.refreshAdmin();
  }
}
