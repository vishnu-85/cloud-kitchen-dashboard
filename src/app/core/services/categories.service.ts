import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Category } from '../models/category.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly api = inject(ApiService);

  getAll(): Observable<Category[]> {
    return this.api.get<Category[]>('/categories');
  }

  create(payload: Partial<Category>): Observable<Category> {
    return this.api.post<Category>('/categories', payload);
  }

  update(id: string, payload: Partial<Category>): Observable<Category> {
    return this.api.patch<Category>(`/categories/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.api.delete<void>(`/categories/${id}`);
  }
}
