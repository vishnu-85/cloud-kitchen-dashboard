import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Order } from '../models/order.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly api = inject(ApiService);

  getAll(): Observable<Order[]> {
    return this.api.get<Order[]>('/orders');
  }

  getById(id: string): Observable<Order> {
    return this.api.get<Order>(`/orders/${id}`);
  }

  create(payload: Partial<Order>): Observable<Order> {
    return this.api.post<Order>('/orders', payload);
  }

  update(id: string, payload: Partial<Order>): Observable<Order> {
    return this.api.patch<Order>(`/orders/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.api.delete<void>(`/orders/${id}`);
  }
}
