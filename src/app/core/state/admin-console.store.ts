import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AffectedServicesAdminApiService } from '../api/services/affected-services-admin-api.service';
import { AdminUsersApiService } from '../api/services/admin-users-api.service';
import type {
  AffectedServiceDto,
  CreateAffectedServiceRequestDto,
  UpdateAffectedServiceRequestDto,
} from '../api/dto/outage.dto';
import type { PortalUserDto } from '../api/dto/portal-user.dto';

@Injectable({ providedIn: 'root' })
export class AdminConsoleStore {
  private readonly usersApi = inject(AdminUsersApiService);
  private readonly servicesApi = inject(AffectedServicesAdminApiService);

  private readonly _users = signal<PortalUserDto[]>([]);
  private readonly _services = signal<AffectedServiceDto[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly users = this._users.asReadonly();
  readonly services = this._services.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  async refreshUsers(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      this._users.set(await firstValueFrom(this.usersApi.list()));
    } catch {
      this._error.set('Unable to load users.');
      this._users.set([]);
    } finally {
      this._loading.set(false);
    }
  }

  async addUserRole(userId: number, roleName: string): Promise<void> {
    this._error.set(null);
    try {
      await firstValueFrom(this.usersApi.addRole(userId, roleName.trim()));
      await this.refreshUsers();
    } catch {
      this._error.set('Unable to add role.');
    }
  }

  async removeUserRole(userId: number, roleName: string): Promise<void> {
    this._error.set(null);
    try {
      await firstValueFrom(this.usersApi.removeRole(userId, roleName.trim()));
      await this.refreshUsers();
    } catch {
      this._error.set('Unable to remove role.');
    }
  }

  async refreshServices(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      this._services.set(await firstValueFrom(this.servicesApi.list()));
    } catch {
      this._error.set('Unable to load affected services.');
      this._services.set([]);
    } finally {
      this._loading.set(false);
    }
  }

  async createService(payload: CreateAffectedServiceRequestDto): Promise<void> {
    this._error.set(null);
    try {
      await firstValueFrom(this.servicesApi.create(payload));
      await this.refreshServices();
    } catch {
      this._error.set('Unable to create service.');
    }
  }

  async updateService(
    id: number,
    payload: UpdateAffectedServiceRequestDto,
  ): Promise<void> {
    this._error.set(null);
    try {
      await firstValueFrom(this.servicesApi.update(id, payload));
      await this.refreshServices();
    } catch {
      this._error.set('Unable to update service.');
    }
  }

  async deleteService(id: number): Promise<void> {
    this._error.set(null);
    try {
      await firstValueFrom(this.servicesApi.remove(id));
      await this.refreshServices();
    } catch {
      this._error.set('Unable to delete service (may still be linked to outages).');
    }
  }
}
