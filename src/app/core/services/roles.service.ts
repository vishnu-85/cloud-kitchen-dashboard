import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private readonly api = inject(ApiService);

  getAll(): Observable<Role[]> {
    return this.api.get<Role[]>('/roles');
  }

  create(payload: Partial<Role>): Observable<Role> {
    return this.api.post<Role>('/roles', payload);
  }

  update(id: string, payload: Partial<Role>): Observable<Role> {
    return this.api.patch<Role>(`/roles/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.api.delete<void>(`/roles/${id}`);
  }

}
