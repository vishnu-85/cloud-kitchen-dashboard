import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { User, UserUpdatePayload } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly api = inject(ApiService);

  getAll(): Observable<User[]> {
    return this.api.get<User[]>('/user');
  }

  update(id: string, payload: UserUpdatePayload): Observable<User> {
    return this.api.patch<User>(`/user/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/user/${id}`);
  }
}
