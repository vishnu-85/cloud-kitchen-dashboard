import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        data: { title: 'Dashboard' },
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'users',
        data: { title: 'Users' },
        loadComponent: () =>
          import('./features/users/users.component').then((m) => m.UsersComponent)
      },
      {
        path: 'roles',
        data: { title: 'Roles' },
        loadComponent: () =>
          import('./features/roles/roles.component').then((m) => m.RolesComponent)
      },
      {
        path: 'permissions',
        data: { title: 'Permissions' },
        loadComponent: () =>
          import('./features/permissions/permissions.component').then((m) => m.PermissionsComponent)
      },
      {
        path: 'categories',
        data: { title: 'Categories' },
        loadComponent: () =>
          import('./features/categories/categories.component').then((m) => m.CategoriesComponent)
      },
      {
        path: 'products/create',
        data: { title: 'Create Product' },
        loadComponent: () =>
          import('./features/products/product-create/product-create.component').then(
            (m) => m.ProductCreateComponent
          )
      },
      {
        path: 'products/:id/edit',
        data: { title: 'Edit Product' },
        loadComponent: () =>
          import('./features/products/product-create/product-create.component').then(
            (m) => m.ProductCreateComponent
          )
      },
      {
        path: 'products',
        data: { title: 'Products' },
        loadComponent: () =>
          import('./features/products/products.component').then((m) => m.ProductsComponent)
      },
      {
        path: 'orders',
        data: { title: 'Orders' },
        loadComponent: () =>
          import('./features/orders/orders.component').then((m) => m.OrdersComponent)
      },
      {
        path: 'settings',
        data: { title: 'Settings' },
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent)
      },
      {
        path: 'movies',
        data: { title: 'Movies' },
        loadComponent: () => 
          import('./features/movies/movies').then((m)=>m.Movies)
      },
       {
        path: 'movies/:id',
        data: { title: 'Movie Details' },
        loadComponent: () => 
          import('./features/movies/movie-detail/movie-details').then((m)=>m.MovieDetails)
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
