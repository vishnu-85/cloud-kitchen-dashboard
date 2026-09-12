import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 class="text-xl font-semibold text-slate-900">General settings</h3>
        <div class="mt-4 space-y-4 text-sm text-slate-600">
          <div class="flex items-center justify-between rounded-xl bg-slate-50 p-3"><span>Business name</span><span class="font-medium text-slate-900">Aster Kitchen Group</span></div>
          <div class="flex items-center justify-between rounded-xl bg-slate-50 p-3"><span>Timezone</span><span class="font-medium text-slate-900">UTC-5 (Central)</span></div>
          <div class="flex items-center justify-between rounded-xl bg-slate-50 p-3"><span>Currency</span><span class="font-medium text-slate-900">USD</span></div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 class="text-xl font-semibold text-slate-900">Automation</h3>
        <div class="mt-4 space-y-4 text-sm text-slate-600">
          <div class="flex items-center justify-between rounded-xl bg-slate-50 p-3"><span>Auto-confirm orders</span><span class="font-medium text-emerald-700">Enabled</span></div>
          <div class="flex items-center justify-between rounded-xl bg-slate-50 p-3"><span>Low-stock alerts</span><span class="font-medium text-emerald-700">Enabled</span></div>
          <div class="flex items-center justify-between rounded-xl bg-slate-50 p-3"><span>Delivery route sync</span><span class="font-medium text-amber-700">Pending</span></div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {}
