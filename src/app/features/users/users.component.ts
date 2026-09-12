import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';

import { User } from '../../core/models/user.model';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, NgClass],
  template: `
    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-xl font-semibold text-slate-900">Users</h3>
        <!-- <button class="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white">Add user</button> -->
      </div>

      @if (errorMessage) {
        <div class="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {{ errorMessage }}
        </div>
      }

      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-4 py-3">Name</th>
              <th class="px-4 py-3">Email</th>
              <th class="px-4 py-3">Role</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            @for (user of users(); track user.id) {
              <tr class="border-t border-slate-200">
                <td class="px-4 py-3">{{ user.name }}</td>
                <td class="px-4 py-3 text-slate-600">{{ user.email }}</td>
                <td class="px-4 py-3">{{ user.roleId }}</td>
                <td class="px-4 py-3">
                  <span class="rounded-full px-2 py-1 text-xs font-medium" [ngClass]="user.isActive === 'active' ? 'bg-emerald-100 text-emerald-700' : user.isActive === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'">
                    {{ user.isActive}}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <button type="button" (click)="deleteUser(user.id)" class="text-sm font-medium text-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class UsersComponent implements OnInit {
  private readonly service = inject(UsersService);

  users:any = signal([]);
  errorMessage = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.service.getAll().subscribe({
      next: (data:any) => {
        this.users.set(data.data);
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Unable to load users.';
      }
    });
  }

  deleteUser(id: string): void {
    this.service.delete(id).subscribe({
      next: () => this.loadUsers(),
      error: () => {
        this.errorMessage = 'Unable to delete user.';
      }
    });
  }
}
