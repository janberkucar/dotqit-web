import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type {
  AdminOutageListDto,
  OutageStatus,
  PublicOutageDto,
} from '../api/dto/outage.dto';
import { AdminOutagesApiService } from '../api/services/admin-outages-api.service';
import { PublicOutagesApiService } from '../api/services/public-outages-api.service';

const ACTIVE_STATUSES: ReadonlySet<OutageStatus> = new Set([
  0, 1, 2, 3,
]);

/**
 * Shared outage signals for client + admin surfaces. Polls the anonymous public
 * feed while consumers hold an active subscription ref-count.
 */
@Injectable({ providedIn: 'root' })
export class OutageStatusService {
  private readonly publicApi = inject(PublicOutagesApiService);
  private readonly adminApi = inject(AdminOutagesApiService);

  private readonly _publicFeed = signal<PublicOutageDto[]>([]);
  private readonly _adminList = signal<AdminOutageListDto[]>([]);

  private publicPollRefCount = 0;
  private publicPollTimer: ReturnType<typeof setInterval> | null = null;

  readonly publicFeed = this._publicFeed.asReadonly();
  readonly adminList = this._adminList.asReadonly();

  readonly activePublicCount = computed(() =>
    this._publicFeed().filter((o) => ACTIVE_STATUSES.has(o.status)).length,
  );

  readonly activeAdminCount = computed(() =>
    this._adminList().filter((o) => ACTIVE_STATUSES.has(o.status)).length,
  );

  /** Approximate MTTR (minutes) from resolved rows visible on the admin list. */
  readonly mttrMinutes = computed(() => {
    const rows = this._adminList().filter(
      (r) => r.status === 4 /* Restored */ && r.resolvedAtUtc,
    );
    if (!rows.length) {
      return null;
    }
    const sum = rows.reduce((acc, r) => {
      const start = Date.parse(r.startedAtUtc);
      const end = Date.parse(r.resolvedAtUtc as string);
      return acc + (end - start) / 60_000;
    }, 0);
    return sum / rows.length;
  });

  /**
   * Reactive filter over the public feed; callers pass getters so plain `ngModel`
   * fields stay compatible with template bindings.
   */
  filterPublicFeed(
    postalCode: () => string,
    area: () => string,
    status: () => OutageStatus | null,
  ): Signal<PublicOutageDto[]> {
    return computed(() => {
      let rows = this._publicFeed();
      const pc = postalCode().trim().toLowerCase();
      if (pc) {
        rows = rows.filter((r) =>
          (r.postalCode ?? '').toLowerCase().includes(pc),
        );
      }
      const ar = area().trim().toLowerCase();
      if (ar) {
        rows = rows.filter((r) =>
          (r.areaLabel ?? '').toLowerCase().includes(ar),
        );
      }
      const st = status();
      if (st != null) {
        rows = rows.filter((r) => r.status === st);
      }
      return rows;
    });
  }

  byStatus(status: OutageStatus): Signal<PublicOutageDto[]> {
    return computed(() =>
      this._publicFeed().filter((r) => r.status === status),
    );
  }

  async refreshPublic(
    filters?: {
      postalCode?: string;
      area?: string;
      status?: OutageStatus | null;
    },
  ): Promise<void> {
    try {
      const rows = await firstValueFrom(this.publicApi.list(filters));
      this._publicFeed.set(rows);
    } catch {
      this._publicFeed.set([]);
    }
  }

  async refreshAdmin(): Promise<void> {
    try {
      const rows = await firstValueFrom(this.adminApi.list());
      this._adminList.set(rows);
    } catch {
      this._adminList.set([]);
    }
  }

  /**
   * Starts polling the public feed every 30s when the first consumer subscribes.
   * Call the returned disposer from `ngOnDestroy`.
   */
  beginPublicPolling(): () => void {
    this.publicPollRefCount++;
    if (this.publicPollRefCount === 1) {
      void this.refreshPublic();
      this.publicPollTimer = globalThis.setInterval(() => {
        void this.refreshPublic();
      }, 30_000);
    }
    return () => {
      this.publicPollRefCount = Math.max(0, this.publicPollRefCount - 1);
      if (this.publicPollRefCount === 0 && this.publicPollTimer != null) {
        globalThis.clearInterval(this.publicPollTimer);
        this.publicPollTimer = null;
      }
    };
  }
}
