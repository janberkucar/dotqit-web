import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import type { AffectedServiceDto } from '../../../core/api/dto/outage.dto';
import {
  OUTAGE_SEVERITY_LABELS,
  OUTAGE_TYPE_LABELS,
} from '../../../core/api/dto/outage.dto';
import { ClientServicesReadApiService } from '../../../core/api/services/client-services-read-api.service';
import { OutageReportsStore } from '../../../core/state/outage-reports.store';

@Component({
  selector: 'app-client-outage-create-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './client-outage-create.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientOutageCreatePage implements OnInit {
  private readonly router = inject(Router);
  private readonly servicesApi = inject(ClientServicesReadApiService);
  readonly outages = inject(OutageReportsStore);

  readonly severityLabels = OUTAGE_SEVERITY_LABELS;
  readonly typeLabels = OUTAGE_TYPE_LABELS;

  readonly availableServices = signal<AffectedServiceDto[]>([]);

  title = '';
  description = '';
  publicMessage = '';
  outageType = 0;
  severity = 1;
  startedAtUtc = new Date().toISOString();
  postalCode = '';
  areaLabel = '';
  street = '';
  estimatedRestorationUtc = '';
  readonly selectedServiceIds = signal<number[]>([]);

  ngOnInit(): void {
    void this.loadServices();
  }

  private async loadServices(): Promise<void> {
    try {
      const list = await firstValueFrom(this.servicesApi.list());
      this.availableServices.set(list);
    } catch {
      this.availableServices.set([]);
    }
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

  async submit(): Promise<void> {
    const eta =
      this.estimatedRestorationUtc.trim().length > 0
        ? this.estimatedRestorationUtc.trim()
        : null;
    const id = await this.outages.create({
      title: this.title.trim(),
      description: this.description.trim(),
      severity: this.severity as 0 | 1 | 2 | 3,
      status: 0,
      startedAtUtc: this.startedAtUtc,
      outageType: this.outageType as 0 | 1 | 2 | 3 | 4,
      publicMessage:
        this.publicMessage.trim().length > 0
          ? this.publicMessage.trim()
          : null,
      postalCode: this.postalCode.trim() || null,
      areaLabel: this.areaLabel.trim() || null,
      street: this.street.trim() || null,
      estimatedRestorationUtc: eta,
      affectedServiceIds:
        this.selectedServiceIds().length > 0
          ? [...this.selectedServiceIds()]
          : undefined,
    });
    if (id !== null) {
      void this.router.navigate(['/client/outages', id]);
    }
  }
}
