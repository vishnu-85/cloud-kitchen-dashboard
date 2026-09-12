import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  readonly isAuthenticated = signal(this.storage.hasToken());

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload).pipe(
      tap((response:any) => {
        const data = response.data;        
        this.storage.setToken(data.token);
        this.storage.setUser(data.user);
        this.isAuthenticated.set(true);
      })
    );
  }

  logout(): void {
    this.storage.clear();
    this.isAuthenticated.set(false);
  }

  getCurrentUser(): User | null {
    return this.storage.getUser();
  }
}
