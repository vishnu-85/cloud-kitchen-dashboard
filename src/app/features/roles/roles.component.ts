import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RolesService } from '../../core/services/roles.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-xl font-semibold text-slate-900">Roles & permissions</h3>
        <button class="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">Manage access</button>
      </div>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        @for (role of roles(); track role.name) {
          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div class="mb-3 flex items-center justify-between">
              <h4 class="text-base font-semibold text-slate-900">{{ role.name }}</h4>
              <span class="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-700">{{ role.status }}</span>
            </div>
            <p class="text-sm text-slate-600">{{ role.description }}</p>
            <ul class="mt-3 space-y-2 text-sm text-slate-600">
                <li><strong>Permissions:</strong></li>
              @for (permission of role.permissions; track permission) {
                <li>• {{ permission }}</li>
              }
            </ul>
          </div>
        }
      </div>
    </div>
  `
})
export class RolesComponent {
  roles:any = signal([])
    loading = false;

  constructor(private service: RolesService) {}

  ngOnInit(){
    this.loadRoles()
  }

  loadRoles(){
    this.loading = true
    this.service.getAll().subscribe({
        next: (res:any)=>{
            this.roles.set(res.data);
            this.loading = false;  
        },
        error:(err)=>{
            console.log(err);
            this.loading = false;
        }
    })
  }


}
