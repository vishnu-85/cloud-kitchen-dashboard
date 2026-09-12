import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-sm font-medium text-slate-500">{{ label() }}</p>
          <h3 class="mt-3 text-3xl font-bold tracking-tight text-slate-900">{{ value() }}</h3>
        </div>
        <div class="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-semibold" [ngClass]="toneClasses()">
          {{ icon() }}
        </div>
      </div>
      @if (delta()) {
        <div class="mt-4 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium" [ngClass]="deltaClasses()">
          <span>{{ delta() }}</span>
        </div>
      }
    </div>
  `
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly delta = input<string>('');
  readonly icon = input<string>('•');
  readonly tone = input<'blue' | 'emerald' | 'amber' | 'pink' | 'violet'>('blue');

  toneClasses(): Record<string, boolean> {
    const tones: Record<string, Record<string, boolean>> = {
      blue: { 'bg-blue-100': true, 'text-blue-700': true },
      emerald: { 'bg-emerald-100': true, 'text-emerald-700': true },
      amber: { 'bg-amber-100': true, 'text-amber-700': true },
      pink: { 'bg-pink-100': true, 'text-pink-700': true },
      violet: { 'bg-violet-100': true, 'text-violet-700': true }
    };

    return tones[this.tone()];
  }

  deltaClasses(): Record<string, boolean> {
    const tones: Record<string, Record<string, boolean>> = {
      blue: { 'bg-blue-50': true, 'text-blue-700': true },
      emerald: { 'bg-emerald-50': true, 'text-emerald-700': true },
      amber: { 'bg-amber-50': true, 'text-amber-700': true },
      pink: { 'bg-pink-50': true, 'text-pink-700': true },
      violet: { 'bg-violet-50': true, 'text-violet-700': true }
    };

    return tones[this.tone()];
  }
}
