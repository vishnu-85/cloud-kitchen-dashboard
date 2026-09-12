import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Address } from '../models/address.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AddressesService {
  private readonly api = inject(ApiService);

  getAll(): Observable<Address[]> {
    return this.api.get<Address[]>('/addresses');
  }

  create(payload: Partial<Address>): Observable<Address> {
    return this.api.post<Address>('/addresses', payload);
  }

  update(id: string, payload: Partial<Address>): Observable<Address> {
    return this.api.patch<Address>(`/addresses/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.api.delete<void>(`/addresses/${id}`);
  }
}
