import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import type { OutageNotificationDto } from '../dto/outage.dto';

@Injectable({ providedIn: 'root' })
export class AdminNotificationsApiService {
  private readonly apiConfig = inject(API_CONFIG);
  private readonly http = inject(HttpClient);

  private readonly base = `${this.apiConfig.baseUrl}/admin/notifications`;

  list(): Observable<OutageNotificationDto[]> {
    return this.http.get<OutageNotificationDto[]>(this.base);
  }

  markRead(id: number): Observable<OutageNotificationDto> {
    return this.http.post<OutageNotificationDto>(`${this.base}/${id}/read`, {});
  }
}
