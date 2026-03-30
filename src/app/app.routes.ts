import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Developer Website Ideas — Open Source Directory',
  },
  {
    path: 'stats',
    loadComponent: () =>
      import('./pages/stats/stats.component').then((m) => m.StatsComponent),
    title: 'Stats — Developer Website Ideas',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
