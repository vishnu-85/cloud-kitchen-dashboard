import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Permission, PermissionPayload } from '../models/permission.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private readonly api = inject(ApiService);

  getAll(): Observable<Permission[]> {
    return this.api.get<Permission[]>('/permissions');
  }

  create(payload: PermissionPayload): Observable<Permission> {
    return this.api.post<Permission>('/permissions', payload);
  }

  update(id: string, payload: PermissionPayload): Observable<Permission> {
    return this.api.patch<Permission>(`/permissions/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.api.delete<void>(`/permissions/${id}`);
  }
}