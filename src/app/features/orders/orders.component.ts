import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { Order } from '../../core/models/order.model';
import { OrdersService } from '../../core/services/orders.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {
  private readonly service = inject(OrdersService);

  orders:any = signal([]);
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';
    this.service.getAll().subscribe({
      next: (data:any) => {
        this.orders.set(data.data);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load orders.';
        this.loading = false;
      }
    });
  }

  updateStatus(orderId: string, status: string): void {
    this.service.update(orderId, { status: status as Order['status'] }).subscribe({
      next: () => this.loadOrders(),
      error: () => {
        this.errorMessage = 'Unable to update order status.';
      }
    });
  }

  getStatusClass(status: string): Record<string, boolean> {
    const map: Record<string, Record<string, boolean>> = {
      pending: { 'bg-amber-100': true, 'text-amber-700': true },
      confirmed: { 'bg-blue-100': true, 'text-blue-700': true },
      preparing: { 'bg-orange-100': true, 'text-orange-700': true },
      ready: { 'bg-emerald-100': true, 'text-emerald-700': true },
      delivered: { 'bg-sky-100': true, 'text-sky-700': true },
      cancelled: { 'bg-red-100': true, 'text-red-700': true }
    };

    return map[status] ?? { 'bg-slate-200': true, 'text-slate-600': true };
  }
}
