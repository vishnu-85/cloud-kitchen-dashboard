import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { User } from '../../core/models/user.model';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, NgClass, RouterLink],
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
            @for (user of users(); track getUserId(user)) {
              <tr class="border-t border-slate-200">
                <td class="px-4 py-3">{{ user.name }}</td>
                <td class="px-4 py-3 text-slate-600">{{ user.email }}</td>
                <td class="px-4 py-3">{{ roleName(user) }}</td>
                <td class="px-4 py-3">
                  <span class="rounded-full px-2 py-1 text-xs font-medium" [ngClass]="isActive(user) ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'">
                    {{ isActive(user) ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <a [routerLink]="['/admin/users', getUserId(user), 'edit']" [state]="{ user: user }" class="mr-3 text-sm font-medium text-orange-700 hover:text-orange-800">
                    Edit
                  </a>
                  <!-- <button type="button" (click)="deleteUser(getUserId(user))" class="text-sm font-medium text-red-600">
                    Delete
                  </button> -->
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

  users = signal<User[]>([]);
  errorMessage = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.service.getAll().subscribe({
      next: (response) => {
        const result = response as unknown as { data?: User[] } | User[];
        this.users.set(Array.isArray(result) ? result : result.data ?? []);
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Unable to load users.';
      }
    });
  }

  deleteUser(id: string): void {
    if (!id) {
      this.errorMessage = 'Unable to find this user.';
      return;
    }

    this.service.delete(id).subscribe({
      next: () => this.loadUsers(),
      error: () => {
        this.errorMessage = 'Unable to delete user.';
      }
    });
  }

  getUserId(user: User): string {
    return user._id ?? user.id ?? '';
  }

  roleName(user: User): string {
    return user.roleName ?? (typeof user.role === 'string' ? user.role : user.role.name);
  }

  isActive(user: User): boolean {
    return user.isActive ?? user.status === 'active';
  }
}
