import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: 'rooms', loadComponent: () => import('./pages/rooms/rooms')},
  {path: 'reservations', loadComponent: () => import('./pages/reservations/reservations')},
  {path: 'add_reservation', loadComponent: () => import('./pages/add_reservation/add_reservation')},
  {path: '', redirectTo: 'rooms', pathMatch: 'full'},
  {path: '**', loadComponent: () => import('./pages/page-404/page-404')},
];
