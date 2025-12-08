import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: 'persons', loadComponent: () => import('./pages/persons/persons')},
  {path: 'packages', loadComponent: () => import('./pages/packages/packages')},
  {path: '', redirectTo: 'persons', pathMatch: 'full'},
  {path: '**', loadComponent: () => import('./pages/page-404/page-404')},
];
