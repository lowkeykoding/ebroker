import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(m => m.RegisterComponent),
      },
    ],
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard',
        data: { svg: 'dashboard' },
      },
      {
        path: 'listings',
        loadComponent: () =>
          import('./features/listings/listing-list/listing-list.component').then(
            m => m.ListingListComponent
          ),
        title: 'Listings',
        data: { svg: 'house' },
      },
      {
        path: 'offers',
        loadComponent: () =>
          import('./features/offers/offer-list/offer-list.component').then(
            m => m.OfferListComponent
          ),
        title: 'Offers',
        data: { svg: 'offer' },
      },
    ],
  },
  { path: '**', redirectTo: '/auth/login' },
];
