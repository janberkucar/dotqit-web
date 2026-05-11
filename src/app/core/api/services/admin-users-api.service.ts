import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { PortalUserDto } from '../dto/portal-user.dto';

@Injectable({ providedIn: 'root' })
export class AdminUsersApiService {
  private readonly apiConfig = inject(API_CONFIG);
  private readonly http = inject(HttpClient);

  private readonly base = `${this.apiConfig.baseUrl}/admin/users`;

  list(): Observable<PortalUserDto[]> {
    return this.http.get<PortalUserDto[]>(this.base);
  }

  addRole(userId: number, roleName: string): Observable<PortalUserDto> {
    return this.http.post<PortalUserDto>(`${this.base}/${userId}/roles`, {
      roleName,
    });
  }

  removeRole(userId: number, roleName: string): Observable<PortalUserDto> {
    const encoded = encodeURIComponent(roleName);
    return this.http.delete<PortalUserDto>(
      `${this.base}/${userId}/roles/${encoded}`,
    );
  }
}
