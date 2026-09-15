import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-slate-100 text-slate-800">
      <div class="flex min-h-screen flex-col lg:flex-row">
        <aside class="w-full border-b border-slate-200 bg-slate-950 text-slate-100 lg:w-72 lg:border-b-0 lg:border-r">
          <div class="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">Cloud Kitchen</p>
              <h1 class="mt-1 text-xl font-bold">Admin Panel</h1>
            </div>
          </div>

          <nav class="space-y-2 p-4">
            @for (item of navigation; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-orange-500/15 text-orange-200"
                [routerLinkActiveOptions]="{ exact: item.path === '/admin/dashboard' }"
                class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                <span class="text-base">{{ item.icon }}</span>
                {{ item.label }}
              </a>
            }
          </nav>

          <div class="mt-auto border-t border-white/10 p-4">
            <div class="mb-3 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/20 text-sm font-semibold text-orange-200">
                {{ initials() }}
              </div>
              <div>
                <p class="text-sm font-medium text-white">{{ currentUser()?.name }} {{ currentUser()?.lastName }}</p>
                <p class="text-xs text-slate-400">{{ currentUser()?.role }}</p>
              </div>
            </div>
            <button (click)="logout()" class="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10">
              Log out
            </button>
          </div>
        </aside>

        <main class="flex-1 overflow-auto">
          <header class="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
            <div class="flex items-center justify-between px-6 py-5">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">Operations overview</p>
                <h2 class="mt-1 text-2xl font-bold text-slate-900">{{ pageTitle }}</h2>
              </div>
              <button class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800">
                + New order
              </button>
            </div>
          </header>

          <div class="p-6">
            <router-outlet />
          </div>
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  currentUser() {
    return this.auth.getCurrentUser();
  }

  readonly navigation = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '◫' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/roles', label: 'Roles', icon: '🛡️' },
    { path: '/admin/categories', label: 'Categories', icon: '📚' },
    { path: '/admin/products', label: 'Products', icon: '🍽️' },
    { path: '/admin/orders', label: 'Orders', icon: '🧾' },
    { path: '/admin/customers', label: 'Customers', icon: '🧍' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' }
  ];

  pageTitle = 'Dashboard';

  initials(): string {
    const user = this.auth.getCurrentUser();
    if (!user) {
      return 'AD';
    }

    return `${user.name.charAt(0)}`.toUpperCase();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
