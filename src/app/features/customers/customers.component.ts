import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-xl font-semibold text-slate-900">Customers</h3>
        <button class="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">Sync CRM</button>
      </div>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        @for (customer of customers; track customer.name) {
          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
                {{ customer.initials }}
              </div>
              <div>
                <h4 class="font-semibold text-slate-900">{{ customer.name }}</h4>
                <p class="text-sm text-slate-600">{{ customer.segment }}</p>
              </div>
            </div>
            <div class="mt-4 flex items-center justify-between text-sm text-slate-600">
              <span>{{ customer.orders }} orders</span>
              <span>{{ customer.value }}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class CustomersComponent {
  readonly customers = [
    { name: 'Maria West', initials: 'MW', segment: 'Loyal', orders: 18, value: '$432' },
    { name: 'Samir Khan', initials: 'SK', segment: 'New', orders: 4, value: '$126' },
    { name: 'Chloe Reed', initials: 'CR', segment: 'VIP', orders: 31, value: '$1,120' }
  ];
}
