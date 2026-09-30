import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Permission } from '../../core/models/permission.model';
import { Role } from '../../core/models/role.model';
import { PermissionsService } from '../../core/services/permissions.service';
import { RolesService } from '../../core/services/roles.service';


@Component({
  selector: 'app-roles',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: 'roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesComponent implements OnInit {
  private readonly service = inject(RolesService);
  private readonly permissionsService = inject(PermissionsService);
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly roles = signal<Role[]>([]);
  readonly availablePermissions = signal<Permission[]>([]);
  readonly showForm = signal(false);
  readonly isLoadingRoles = signal(false);
  readonly isLoadingPermissions = signal(false);
  readonly isSaving = signal(false);
  readonly updatingRoleId = signal<string | null>(null);
  readonly editingRoleId = signal<string | null>(null);
  readonly errorMessage = signal('');

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(250)]],
    permissions: this.fb.control<string[]>([]),
    isActive: [true]
  });

  ngOnInit(): void {
    this.loadRoles();
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

  editRole(role: Role): void {
    this.editingRoleId.set(role._id);
    this.form.setValue({
      name: role.name,
      description: role.description,
      permissions: role.permissions ?? [],
      isActive: role.isActive
    });
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

    const id = this.editingRoleId();
    const payload = this.form.getRawValue();
    this.isSaving.set(true);
    this.errorMessage.set('');

    const request = id ? this.service.update(id, payload) : this.service.create(payload);
    request.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.cancelForm();
        this.loadRoles();
      },
      error: () => {
        this.isSaving.set(false);
        this.errorMessage.set(`Unable to ${id ? 'update' : 'create'} role. Please try again.`);
      }
    });
  }

  updateStatus(role: Role, event: Event): void {
    const isActive = (event.target as HTMLInputElement).checked;
    this.updatingRoleId.set(role._id);
    this.errorMessage.set('');
    this.service.update(role._id, { isActive }).subscribe({
      next: () => {
        this.updatingRoleId.set(null);
        this.loadRoles();
      },
      error: () => {
        this.updatingRoleId.set(null);
        this.errorMessage.set(`Unable to update ${role.name} status.`);
      }
    });
  }

  permissionLabel(permissionName: string): string {
    return this.availablePermissions().find((permission) => permission.name === permissionName)?.label ?? permissionName;
  }

  private loadRoles(): void {
    this.isLoadingRoles.set(true);
    this.service.getAll().subscribe({
      next: (response) => {
        const result = response as unknown as { data?: Role[] } | Role[];
        this.roles.set(Array.isArray(result) ? result : result.data ?? []);
        this.isLoadingRoles.set(false);
      },
      error: () => {
        this.isLoadingRoles.set(false);
        this.errorMessage.set('Unable to load roles. Please try again.');
      }
    });
  }

  private loadPermissions(): void {
    this.isLoadingPermissions.set(true);
    this.permissionsService.getAll().subscribe({
      next: (response) => {
        const result = response as unknown as { data?: Permission[] } | Permission[];
        this.availablePermissions.set(Array.isArray(result) ? result : result.data ?? []);
        this.isLoadingPermissions.set(false);
      },
      error: () => {
        this.isLoadingPermissions.set(false);
        this.errorMessage.set('Unable to load permissions. Please try again.');
      }
    });
  }

  private resetForm(): void {
    this.form.reset({ name: '', description: '', permissions: [], isActive: true });
    this.editingRoleId.set(null);
    this.errorMessage.set('');
  }
}