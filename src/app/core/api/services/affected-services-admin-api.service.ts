import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
  AffectedServiceDto,
  CreateAffectedServiceRequestDto,
  UpdateAffectedServiceRequestDto,
} from '../dto/outage.dto';

@Injectable({ providedIn: 'root' })
export class AffectedServicesAdminApiService {
  private readonly apiConfig = inject(API_CONFIG);
  private readonly http = inject(HttpClient);

  private readonly base = `${this.apiConfig.baseUrl}/admin/services`;

  list(): Observable<AffectedServiceDto[]> {
    return this.http.get<AffectedServiceDto[]>(this.base);
  }

  create(payload: CreateAffectedServiceRequestDto): Observable<AffectedServiceDto> {
    return this.http.post<AffectedServiceDto>(this.base, payload);
  }

  update(
    id: number,
    payload: UpdateAffectedServiceRequestDto,
  ): Observable<AffectedServiceDto> {
    return this.http.put<AffectedServiceDto>(`${this.base}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
