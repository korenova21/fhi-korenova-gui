import { Routes } from '@angular/router';

export const routes: Routes = [
  // Izby
  {path: 'rooms', loadComponent: () => import('./pages/rooms/rooms')},

  // Rezervácie
  {path: 'reservations', loadComponent: () => import('./pages/reservations/reservations')},

  // Hostia (Toto je tá nová stránka)
  {path: 'guests', loadComponent: () => import('./pages/guests/guests')},

  // Presmerovanie a 404
  {path: '', redirectTo: 'rooms', pathMatch: 'full'},
  {path: '**', loadComponent: () => import('./pages/page-404/page-404')},
];
