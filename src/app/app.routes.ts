import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Developer Website Ideas — Open Source Developer Portfolio Directory',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
