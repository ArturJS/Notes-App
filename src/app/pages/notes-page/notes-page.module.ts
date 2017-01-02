/**
 * Created by Artur_Nizamutdinov on 10/11/2016.
 */
import { NgModule } from '@angular/core';
import { NotesPage } from './notes-page.component.ts';
import { Note } from './note/note.component';
import { LoginPopup } from './login-popup/login-popup.component';
import { StretchByContentDirective } from './directives/stretch-by-content.directive.ts';
import { CollapseDirective } from './directives/collapse.directive.ts';

import { SharedModule } from './../../shared';
import { NotesEffects } from './notes.effects.ts';
import { ROUTING } from './notes-page.routing.ts';
import { EffectsModule } from '@ngrx/effects';
import { NotesActions } from './notes.actions.ts';

@NgModule({
  imports: [
    SharedModule,
    ROUTING,
    EffectsModule.run(NotesEffects)
  ],
  declarations: [
    NotesPage,
    Note,
    LoginPopup,
    StretchByContentDirective,
    CollapseDirective
  ],
  providers: [
    NotesActions
  ]
})
export default class NotesPageModule {
}
