/**
 * Created by Artur_Nizamutdinov on 10/19/2016.
 */
import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {AuthService} from './../../shared/services';
import {NotesActions} from './notes.actions.ts';
import {User} from './../../shared/entities';

@Injectable()
export class NotesEffects {
  constructor(private actions$: Actions,
              private authService: AuthService,
              private loginActions: NotesActions) {
  }

  /*@Effect() login$ = this.actions$
  // Listen for the 'LOGIN' action
    .ofType(NoteActions.LOGIN)
    .map(action => new User(action.payload))
    .switchMap(user => this.authService.doNote(user)
    // If successful, dispatch success action with result
      .map(() => this.loginActions.loginSuccess())
      // If request fails, dispatch failed action
      .catch(() => {
        return Observable.of(this.loginActions.loginFailed())
      })
    );*/
}
