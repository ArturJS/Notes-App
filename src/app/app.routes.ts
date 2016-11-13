import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

declare var System:any;
export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/notes',
    pathMatch: 'full'
  },

  {
    path: 'notes',
    loadChildren: () => System.import('./pages/notes-page/notes-page.module')
  },

  {
    path: '**',
    redirectTo: '/notes'
  },
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES, { useHash: true });
