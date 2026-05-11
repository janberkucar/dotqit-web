import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminConsoleStore } from '../../../core/state/admin-console.store';

@Component({
  selector: 'app-admin-services-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-services.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminServicesPage implements OnInit {
  readonly admin = inject(AdminConsoleStore);

  name = '';
  environment = '';
  owner = '';
  criticality = '';

  ngOnInit(): void {
    void this.admin.refreshServices();
  }

  async create(): Promise<void> {
    await this.admin.createService({
      name: this.name.trim(),
      environment: this.environment.trim(),
      owner: this.owner.trim(),
      criticality: this.criticality.trim(),
    });
    this.name = '';
    this.environment = '';
    this.owner = '';
    this.criticality = '';
  }

  async remove(id: number): Promise<void> {
    await this.admin.deleteService(id);
  }
}
