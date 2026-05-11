import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { AffectedServiceDto } from '../dto/outage.dto';

@Injectable({ providedIn: 'root' })
export class ClientServicesReadApiService {
  private readonly apiConfig = inject(API_CONFIG);
  private readonly http = inject(HttpClient);

  list(): Observable<AffectedServiceDto[]> {
    return this.http.get<AffectedServiceDto[]>(
      `${this.apiConfig.baseUrl}/client/services`,
    );
  }
}
