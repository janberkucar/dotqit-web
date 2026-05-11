import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  OUTAGE_SEVERITY_LABELS,
  OUTAGE_TYPE_LABELS,
} from '../../core/api/dto/outage.dto';
import { PublicOutagesApiService } from '../../core/api/services/public-outages-api.service';

@Component({
  selector: 'app-public-outage-report-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './public-outage-report.page.html',
  styleUrl: './public-outage-report.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicOutageReportPage {
  private readonly api = inject(PublicOutagesApiService);

  readonly severityLabels = OUTAGE_SEVERITY_LABELS;
  readonly typeLabels = OUTAGE_TYPE_LABELS;

  title = '';
  description = '';
  outageType = 0;
  severity = 1;
  postalCode = '';
  areaLabel = '';
  street = '';
  contactEmail = '';

  readonly submitting = signal(false);
  readonly successMessage = signal<string | null>(null);

  async submit(): Promise<void> {
    this.submitting.set(true);
    this.successMessage.set(null);
    try {
      const res = await firstValueFrom(
        this.api.reportAnonymous({
          title: this.title.trim(),
          description: this.description.trim(),
          outageType: this.outageType as 0 | 1 | 2 | 3 | 4,
          severity: this.severity as 0 | 1 | 2 | 3,
          postalCode: this.postalCode.trim() || null,
          areaLabel: this.areaLabel.trim() || null,
          street: this.street.trim() || null,
          contactEmail: this.contactEmail.trim() || null,
        }),
      );
      this.successMessage.set(res.message);
      this.title = '';
      this.description = '';
    } catch {
      this.successMessage.set(null);
    } finally {
      this.submitting.set(false);
    }
  }
}
