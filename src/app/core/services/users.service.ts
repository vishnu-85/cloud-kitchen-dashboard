import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly api = inject(ApiService);

  getAll(): Observable<User[]> {
    return this.api.get<User[]>('/auth/users');
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/auth/users/${id}`);
  }
}
