import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(m => m.LoginComponent),
      },
    ],
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'listings',
        loadComponent: () =>
          import('./features/listings/listing-list/listing-list.component').then(
            m => m.ListingListComponent
          ),
      },
      { path: '', redirectTo: 'listings', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/listings' },
];
