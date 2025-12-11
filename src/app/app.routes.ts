import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: 'rooms', loadComponent: () => import('./pages/rooms/rooms')},
  {path: 'reservations', loadComponent: () => import('./pages/reservations/reservations')},

  // DÔLEŽITÉ: Tu musí byť cesta k súboru, ktorý si si nechala (guests)
  {path: 'guests', loadComponent: () => import('./pages/guests/guests')},

  {path: '', redirectTo: 'rooms', pathMatch: 'full'},
  {path: '**', loadComponent: () => import('./pages/page-404/page-404')},
];
