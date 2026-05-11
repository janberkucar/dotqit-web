import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AdminOutagesApiService } from '../api/services/admin-outages-api.service';
import { ClientOutagesApiService } from '../api/services/client-outages-api.service';
import type {
  AdminOutageDetailDto,
  CreateOutageReportRequestDto,
  UpdateOutageReportRequestDto,
} from '../api/dto/outage.dto';
import { OutageStatusService } from './outage-status.service';

@Injectable({ providedIn: 'root' })
export class OutageReportsStore {
  private readonly clientApi = inject(ClientOutagesApiService);
  private readonly adminApi = inject(AdminOutagesApiService);
  private readonly outageStatus = inject(OutageStatusService);

  private readonly _detail = signal<AdminOutageDetailDto | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly detail = this._detail.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  private async syncCatalogs(): Promise<void> {
    await Promise.all([
      this.outageStatus.refreshPublic(),
      this.outageStatus.refreshAdmin(),
    ]);
  }

  async loadDetail(id: number, mode: 'admin' | 'client'): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const dto = await firstValueFrom(
        mode === 'admin'
          ? this.adminApi.getById(id)
          : this.clientApi.getById(id),
      );
      this._detail.set(dto);
    } catch {
      this._error.set('Unable to load outage.');
      this._detail.set(null);
    } finally {
      this._loading.set(false);
    }
  }

  clearDetail(): void {
    this._detail.set(null);
  }

  async create(payload: CreateOutageReportRequestDto): Promise<number | null> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const body: CreateOutageReportRequestDto = {
        ...payload,
        outageType: payload.outageType ?? 0,
        status: payload.status ?? 0,
      };
      const created = await firstValueFrom(this.clientApi.create(body));
      await this.syncCatalogs();
      return created.id;
    } catch {
      this._error.set('Unable to create outage report.');
      return null;
    } finally {
      this._loading.set(false);
    }
  }

  async update(
    id: number,
    payload: UpdateOutageReportRequestDto,
  ): Promise<boolean> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const dto = await firstValueFrom(this.adminApi.update(id, payload));
      this._detail.set(dto);
      await this.syncCatalogs();
      return true;
    } catch {
      this._error.set('Unable to update outage.');
      return false;
    } finally {
      this._loading.set(false);
    }
  }

  async publish(id: number, published: boolean): Promise<boolean> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const dto = await firstValueFrom(
        this.adminApi.publish(id, { published }),
      );
      this._detail.set(dto);
      await this.syncCatalogs();
      return true;
    } catch {
      this._error.set('Unable to publish outage.');
      return false;
    } finally {
      this._loading.set(false);
    }
  }

  async remove(id: number): Promise<boolean> {
    this._loading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.adminApi.remove(id));
      this._detail.set(null);
      await this.syncCatalogs();
      return true;
    } catch {
      this._error.set('Unable to delete outage.');
      return false;
    } finally {
      this._loading.set(false);
    }
  }

  async addTimelineUpdate(id: number, message: string): Promise<boolean> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const dto = await firstValueFrom(
        this.adminApi.addUpdate(id, { message }),
      );
      this._detail.set(dto);
      await this.syncCatalogs();
      return true;
    } catch {
      this._error.set('Unable to add update.');
      return false;
    } finally {
      this._loading.set(false);
    }
  }
}
