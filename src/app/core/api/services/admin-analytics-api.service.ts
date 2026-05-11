import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import type { AnalyticsKpisDto } from '../dto/outage.dto';

@Injectable({ providedIn: 'root' })
export class AdminAnalyticsApiService {
  private readonly apiConfig = inject(API_CONFIG);
  private readonly http = inject(HttpClient);

  kpis(): Observable<AnalyticsKpisDto> {
    return this.http.get<AnalyticsKpisDto>(
      `${this.apiConfig.baseUrl}/admin/analytics/kpis`,
    );
  }
}
