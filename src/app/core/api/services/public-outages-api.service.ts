import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import type {
  AnonymousPublicReportRequestDto,
  AnonymousPublicReportResponseDto,
  OutageStatus,
  PublicOutageDto,
} from '../dto/outage.dto';

@Injectable({ providedIn: 'root' })
export class PublicOutagesApiService {
  private readonly apiConfig = inject(API_CONFIG);
  private readonly http = inject(HttpClient);

  private readonly base = `${this.apiConfig.baseUrl}/public/outages`;

  list(filters?: {
    postalCode?: string;
    area?: string;
    status?: OutageStatus | null;
  }): Observable<PublicOutageDto[]> {
    let params = new HttpParams();
    if (filters?.postalCode?.trim()) {
      params = params.set('postalCode', filters.postalCode.trim());
    }
    if (filters?.area?.trim()) {
      params = params.set('area', filters.area.trim());
    }
    if (filters?.status != null) {
      params = params.set('status', String(filters.status));
    }
    return this.http.get<PublicOutageDto[]>(this.base, { params });
  }

  getById(id: number): Observable<PublicOutageDto> {
    return this.http.get<PublicOutageDto>(`${this.base}/${id}`);
  }

  reportAnonymous(
    payload: AnonymousPublicReportRequestDto,
  ): Observable<AnonymousPublicReportResponseDto> {
    return this.http.post<AnonymousPublicReportResponseDto>(
      `${this.base}/report`,
      payload,
    );
  }
}
