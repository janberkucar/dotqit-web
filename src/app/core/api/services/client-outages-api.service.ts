import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import type {
  AdminOutageDetailDto,
  AdminOutageListDto,
  CreateOutageReportRequestDto,
  PublicOutageDto,
} from '../dto/outage.dto';

@Injectable({ providedIn: 'root' })
export class ClientOutagesApiService {
  private readonly apiConfig = inject(API_CONFIG);
  private readonly http = inject(HttpClient);

  private readonly base = `${this.apiConfig.baseUrl}/client/outages`;

  /** Published citizen feed (same payload as public API). */
  list(): Observable<PublicOutageDto[]> {
    return this.http.get<PublicOutageDto[]>(this.base);
  }

  /** Authenticated user's submitted reports. */
  history(): Observable<AdminOutageListDto[]> {
    return this.http.get<AdminOutageListDto[]>(`${this.base}/history`);
  }

  getById(id: number): Observable<AdminOutageDetailDto> {
    return this.http.get<AdminOutageDetailDto>(`${this.base}/${id}`);
  }

  create(payload: CreateOutageReportRequestDto): Observable<AdminOutageDetailDto> {
    return this.http.post<AdminOutageDetailDto>(this.base, payload);
  }
}
