import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Role } from '../../core/models/role.model';
import { User, UserUpdatePayload } from '../../core/models/user.model';
import { RolesService } from '../../core/services/roles.service';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-user-edit',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="mx-auto max-w-3xl">
      <header class="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-widest text-orange-700">User management</p>
          <h1 class="mt-1 text-3xl font-bold text-slate-950">Edit user</h1>
          <p class="mt-2 text-sm text-slate-600">Update account details and access role.</p>
        </div>
        <a routerLink="/admin/users" class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Back to users</a>
      </header>

      @if (isLoadingUser()) {
        <p class="mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600" role="status">Loading user details…</p>
      }
      @if (errorMessage()) {
        <p class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{{ errorMessage() }}</p>
      }

      <form [formGroup]="form" (ngSubmit)="save()" class="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
        <div class="grid gap-5 md:grid-cols-2">
          <div class="flex flex-col gap-1.5">
            <label for="user-name" class="text-sm font-semibold text-slate-700">First name</label>
            <input id="user-name" formControlName="name" autocomplete="given-name" class="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
            @if (form.controls.name.touched && form.controls.name.invalid) {
              <span class="text-sm text-red-700">Enter a name.</span>
            }
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="user-last-name" class="text-sm font-semibold text-slate-700">Last name</label>
            <input id="user-last-name" formControlName="lastName" autocomplete="family-name" class="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
            @if (form.controls.lastName.touched && form.controls.lastName.invalid) {
              <span class="text-sm text-red-700">Enter a last name.</span>
            }
          </div>
          <div class="flex flex-col gap-1.5 md:col-span-2">
            <label for="user-email" class="text-sm font-semibold text-slate-700">Email</label>
            <input id="user-email" type="email" formControlName="email" autocomplete="email" class="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
            @if (form.controls.email.touched && form.controls.email.invalid) {
              <span class="text-sm text-red-700">Enter a valid email address.</span>
            }
          </div>
          <div class="flex flex-col gap-1.5 md:col-span-2">
            <label for="user-role" class="text-sm font-semibold text-slate-700">Role</label>
            <select id="user-role" formControlName="role" class="rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100">
              <option value="" disabled>{{ isLoadingRoles() ? 'Loading roles…' : 'Select a role' }}</option>
              @for (role of roles(); track role._id) {
                <option [value]="role._id">{{ role.name }}</option>
              }
            </select>
            @if (form.controls.role.touched && form.controls.role.invalid) {
              <span class="text-sm text-red-700">Select a role.</span>
            }
          </div>
          <label for="user-active" class="flex min-h-11 items-center gap-3 text-sm font-medium text-slate-700 md:col-span-2">
            <input id="user-active" type="checkbox" formControlName="isActive" class="h-4 w-4 accent-orange-600" />
            Account is active
          </label>
        </div>

        <footer class="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
          <a routerLink="/admin/users" class="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</a>
          <button type="submit" [disabled]="isSaving() || isLoadingUser() || !userId()" class="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60">
            {{ isSaving() ? 'Saving…' : 'Save changes' }}
          </button>
        </footer>
      </form>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);
  private readonly rolesService = inject(RolesService);

  readonly userId = signal<string | null>(null);
  readonly roles = signal<Role[]>([]);
  readonly isLoadingUser = signal(false);
  readonly isLoadingRoles = signal(false);
  readonly isSaving = signal(false);
  readonly errorMessage = signal('');
  private loadedUser: User | null = null;

  readonly form = this.fb.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    isActive: [true]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.userId.set(id);
    if (!id) {
      this.errorMessage.set('User ID is missing. Return to the users list and try again.');
      return;
    }

    const routeUser = (history.state as { user?: User }).user;
    if (routeUser && this.getUserId(routeUser) === id) {
      this.populateForm(routeUser);
    } else {
      this.loadUser(id);
    }
    this.loadRoles();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.userId();
    if (!id) {
      this.errorMessage.set('User ID is missing.');
      return;
    }

    const payload: UserUpdatePayload = this.form.getRawValue();
    this.isSaving.set(true);
    this.errorMessage.set('');
    this.usersService.update(id, payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        void this.router.navigate(['/admin/users']);
      },
      error: () => {
        this.isSaving.set(false);
        this.errorMessage.set('Unable to update user. Please try again.');
      }
    });
  }

  private loadUser(id: string): void {
    this.isLoadingUser.set(true);
    this.usersService.getAll().subscribe({
      next: (response) => {
        const result = response as unknown as { data?: User[] } | User[];
        const users = Array.isArray(result) ? result : result.data ?? [];
        const user = users.find((item) => this.getUserId(item) === id);
        if (user) {
          this.populateForm(user);
        } else {
          this.errorMessage.set('User not found. Return to the users list and try again.');
        }
        this.isLoadingUser.set(false);
      },
      error: () => {
        this.isLoadingUser.set(false);
        this.errorMessage.set('Unable to load user details. Please try again.');
      }
    });
  }

  private loadRoles(): void {
    this.isLoadingRoles.set(true);
    this.rolesService.getAll().subscribe({
      next: (response) => {
        const result = response as unknown as { data?: Role[] } | Role[];
        const roles = Array.isArray(result) ? result : result.data ?? [];
        this.roles.set(roles);
        if (this.loadedUser) {
          this.populateForm(this.loadedUser);
        }
        this.isLoadingRoles.set(false);
      },
      error: () => {
        this.isLoadingRoles.set(false);
        this.errorMessage.set('Unable to load available roles.');
      }
    });
  }

  private populateForm(user: User): void {
    this.loadedUser = user;
    const rawRole = typeof user.role === 'string' ? user.role : user.role?._id;
    const roleId = this.roles().find((role) => role._id === rawRole || role.name === rawRole)?. _id ?? rawRole ?? '';
    this.form.setValue({
      name: user.name ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      role: roleId,
      isActive: user.isActive ?? user.status === 'active'
    });
  }

  private getUserId(user: User): string {
    return user._id ?? user.id ?? '';
  }
}