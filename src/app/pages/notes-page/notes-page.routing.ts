/**
 * Created by Artur_Nizamutdinov on 10/11/2016.
 */
import { Routes, RouterModule } from '@angular/router';
import { NotesPage } from './notes-page.component.ts';

const ROUTES: Routes = [
  {
    path: '',
    component: NotesPage,
    pathMatch: 'full'
  }
];

export const ROUTING = RouterModule.forChild(ROUTES);
