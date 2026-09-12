import { Injectable } from '@angular/core';

import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly tokenKey = 'ck_admin_token';
  private readonly userKey = 'ck_admin_user';

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): User | null {
    const raw = localStorage.getItem(this.userKey);
    return raw ? (JSON.parse(raw) as User) : null;
  }

  removeUser(): void {
    localStorage.removeItem(this.userKey);
  }

  clear(): void {
    this.removeToken();
    this.removeUser();
  }

  hasToken(): boolean {
    return Boolean(this.getToken());
  }
}
