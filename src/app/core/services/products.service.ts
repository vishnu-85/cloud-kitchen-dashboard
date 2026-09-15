import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Product } from '../models/product.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly api = inject(ApiService);

  getAll(): Observable<Product[]> {
    return this.api.get<Product[]>('/products');
  }

  create(payload: Partial<Product>): Observable<Product> {
    return this.api.post<Product>('/products', payload);
  }

  update(id: string, payload: Partial<Product>): Observable<Product> {
    return this.api.patch<Product>(`/products/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.api.delete<void>(`/products/${id}`);
  }

  downloadTemplate(): Observable<Blob> {
    return this.api.getBlob('/product-data/product-template');
  }
  uploadProducts(file: FormData): Observable<void> {
    return this.api.post('/product-data/product-upload', file);
  }
}
