import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import type {
  AddOutageUpdateRequestDto,
  AdminOutageDetailDto,
  AdminOutageListDto,
  CreateOutageReportRequestDto,
  PublishOutageRequestDto,
  UpdateOutageReportRequestDto,
} from '../dto/outage.dto';

@Injectable({ providedIn: 'root' })
export class AdminOutagesApiService {
  private readonly apiConfig = inject(API_CONFIG);
  private readonly http = inject(HttpClient);

  private readonly base = `${this.apiConfig.baseUrl}/admin/outages`;

  list(): Observable<AdminOutageListDto[]> {
    return this.http.get<AdminOutageListDto[]>(this.base);
  }

  getById(id: number): Observable<AdminOutageDetailDto> {
    return this.http.get<AdminOutageDetailDto>(`${this.base}/${id}`);
  }

  create(payload: CreateOutageReportRequestDto): Observable<AdminOutageDetailDto> {
    return this.http.post<AdminOutageDetailDto>(this.base, payload);
  }

  update(
    id: number,
    payload: UpdateOutageReportRequestDto,
  ): Observable<AdminOutageDetailDto> {
    return this.http.put<AdminOutageDetailDto>(`${this.base}/${id}`, payload);
  }

  publish(
    id: number,
    payload: PublishOutageRequestDto,
  ): Observable<AdminOutageDetailDto> {
    return this.http.post<AdminOutageDetailDto>(
      `${this.base}/${id}/publish`,
      payload,
    );
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  addUpdate(
    id: number,
    payload: AddOutageUpdateRequestDto,
  ): Observable<AdminOutageDetailDto> {
    return this.http.post<AdminOutageDetailDto>(
      `${this.base}/${id}/updates`,
      payload,
    );
  }
}
