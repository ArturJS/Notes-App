import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

declare var System:any;
export const ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => System.import('./pages/notes-page/notes-page.module')
  },

  {
    path: '**',
    redirectTo: ''
  },
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES, { useHash: true });
