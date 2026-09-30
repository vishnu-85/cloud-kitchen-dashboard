import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Permission } from '../../core/models/permission.model';
import { PermissionsService } from '../../core/services/permissions.service';

@Component({
  selector: 'app-permissions',
  imports: [ReactiveFormsModule],
  template: `
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-xl font-semibold text-slate-900">Permissions</h2>
          <p class="mt-1 text-sm text-slate-600">Manage the permissions available to roles.</p>
        </div>
        <button
          type="button"
          (click)="toggleForm()"
          class="rounded-xl bg-orange-600 px-3 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
          {{ showForm() ? 'Close' : 'New permission' }}
        </button>
      </header>

      @if (showForm()) {
        <form [formGroup]="form" (ngSubmit)="save()" class="mb-5 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
          <h3 class="text-lg font-semibold text-slate-900 md:col-span-2">
            {{ editingPermissionId() ? 'Edit permission' : 'Create permission' }}
          </h3>
          <div class="flex flex-col gap-1.5">
            <label for="permission-name" class="text-sm font-medium text-slate-700">Name</label>
            <input id="permission-name" formControlName="name" maxlength="100" class="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
            @if (form.controls.name.touched && form.controls.name.invalid) {
              <span class="text-sm text-red-700">Enter a permission name.</span>
            }
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="permission-label" class="text-sm font-medium text-slate-700">Label</label>
            <input id="permission-label" formControlName="label" maxlength="120" class="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
            @if (form.controls.label.touched && form.controls.label.invalid) {
              <span class="text-sm text-red-700">Enter a display label.</span>
            }
          </div>
          <div class="flex justify-end gap-2 md:col-span-2">
            <button type="button" (click)="cancelForm()" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white">Cancel</button>
            <button type="submit" [disabled]="isSaving()" class="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
              {{ isSaving() ? 'Saving…' : (editingPermissionId() ? 'Update permission' : 'Create permission') }}
            </button>
          </div>
        </form>
      }

      @if (errorMessage()) {
        <p class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{{ errorMessage() }}</p>
      }

      @if (isLoading()) {
        <p class="py-8 text-center text-sm text-slate-600" role="status">Loading permissions…</p>
      } @else if (permissions().length === 0) {
        <p class="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-600">No permissions have been created.</p>
      } @else {
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          @for (permission of permissions(); track permission._id) {
            <article class="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <h3 class="break-words font-semibold text-slate-900">{{ permission.label }}</h3>
                  <p class="mt-1 break-all font-mono text-sm text-slate-600">{{ permission.name }}</p>
                </div>
                <div class="flex shrink-0 gap-3">
                  <button type="button" (click)="editPermission(permission)" class="text-sm font-medium text-orange-700 hover:text-orange-800" [attr.aria-label]="'Edit ' + permission.label">Edit</button>
                  <button type="button" (click)="deletePermission(permission)" class="text-sm font-medium text-red-700 hover:text-red-800" [attr.aria-label]="'Delete ' + permission.label">Delete</button>
                </div>
              </div>
            </article>
          }
        </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionsComponent implements OnInit {
  private readonly service = inject(PermissionsService);
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly permissions = signal<Permission[]>([]);
  readonly showForm = signal(false);
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly editingPermissionId = signal<string | null>(null);
  readonly errorMessage = signal('');

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    label: ['', [Validators.required, Validators.maxLength(120)]]
  });

  ngOnInit(): void {
    this.loadPermissions();
  }

  toggleForm(): void {
    if (this.showForm()) {
      this.cancelForm();
      return;
    }

    this.resetForm();
    this.showForm.set(true);
  }

  editPermission(permission: Permission): void {
    this.editingPermissionId.set(permission._id);
    this.form.setValue({ name: permission.name, label: permission.label });
    this.errorMessage.set('');
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.resetForm();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.editingPermissionId();
    const payload = this.form.getRawValue();
    this.isSaving.set(true);
    this.errorMessage.set('');

    const request = id ? this.service.update(id, payload) : this.service.create(payload);
    request.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.cancelForm();
        this.loadPermissions();
      },
      error: () => {
        this.isSaving.set(false);
        this.errorMessage.set(`Unable to ${id ? 'update' : 'create'} permission. Please try again.`);
      }
    });
  }

  deletePermission(permission: Permission): void {
    if (!window.confirm(`Delete the permission "${permission.label}"?`)) {
      return;
    }

    this.errorMessage.set('');
    this.service.remove(permission._id).subscribe({
      next: () => this.loadPermissions(),
      error: () => this.errorMessage.set('Unable to delete permission. Please try again.')
    });
  }

  private loadPermissions(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.service.getAll().subscribe({
      next: (response) => {
        const result = response as unknown as { data?: Permission[] } | Permission[];
        this.permissions.set(Array.isArray(result) ? result : result.data ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Unable to load permissions. Please try again.');
      }
    });
  }

  private resetForm(): void {
    this.form.reset({ name: '', label: '' });
    this.editingPermissionId.set(null);
    this.errorMessage.set('');
  }
}