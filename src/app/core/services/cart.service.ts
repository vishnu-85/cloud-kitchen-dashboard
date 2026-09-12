import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Cart } from '../models/cart.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly api = inject(ApiService);

  getCart(): Observable<Cart> {
    return this.api.get<Cart>('/cart');
  }

  addItem(payload: { productId: string; quantity: number }): Observable<Cart> {
    return this.api.post<Cart>('/cart', payload);
  }

  updateItem(id: string, payload: { quantity: number }): Observable<Cart> {
    return this.api.patch<Cart>(`/cart/${id}`, payload);
  }

  removeItem(id: string): Observable<void> {
    return this.api.delete<void>(`/cart/${id}`);
  }
}
