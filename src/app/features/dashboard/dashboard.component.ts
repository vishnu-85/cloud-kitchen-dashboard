import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  template: `
    <div class="space-y-6">
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        @for (metric of metrics; track metric.label) {
          <app-stat-card [label]="metric.label" [value]="metric.value" [delta]="metric.delta" [icon]="metric.icon" [tone]="metric.tone" />
        }
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="mb-5 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-900">Revenue overview</h3>
            <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">+18.3%</span>
          </div>
          <div class="grid grid-cols-7 gap-3">
            @for (bar of revenueBars; track bar) {
              <div class="flex flex-col items-center gap-2">
                <div class="w-full rounded-t-2xl bg-gradient-to-t from-orange-500 to-amber-400" [style.height.px]="bar"></div>
                <span class="text-xs text-slate-500">{{ barLabel[$index] }}</span>
              </div>
            }
          </div>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 class="text-lg font-semibold text-slate-900">Service mix</h3>
          <div class="mt-5 space-y-4">
            @for (item of serviceMix; track item.label) {
              <div>
                <div class="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>{{ item.label }}</span>
                  <span>{{ item.value }}%</span>
                </div>
                <div class="h-2.5 rounded-full bg-slate-100">
                  <div class="h-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400" [style.width.%]="item.value"></div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  readonly metrics = [
    { label: 'Gross revenue', value: '$84.2k', delta: '+12.5%', icon: '💰', tone: 'blue' as const },
    { label: 'Orders', value: '1,284', delta: '+8.1%', icon: '🧾', tone: 'emerald' as const },
    { label: 'Avg. ticket', value: '$72.4', delta: '+4.8%', icon: '🛒', tone: 'amber' as const },
    { label: 'Customers', value: '6,930', delta: '+16.7%', icon: '👥', tone: 'violet' as const }
  ];

  readonly revenueBars = [48, 64, 52, 78, 96, 72, 110];
  readonly barLabel = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  readonly serviceMix = [
    { label: 'Delivery', value: 54 },
    { label: 'Pickup', value: 28 },
    { label: 'Dine-in', value: 18 }
  ];
}
