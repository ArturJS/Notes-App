/**
 * Created by Artur_Nizamutdinov on 10/19/2016.
 */

import {Injectable} from '@angular/core';
import {Store, Action} from '@ngrx/store';

@Injectable()
export class NotesActions {
  constructor(private _store:Store<any>) {
  }

 /* static LOGIN = 'LOGIN';
  login(user:User):Action{
    return <Action>{
      type: NoteActions.LOGIN,
      payload: user
    };
  }

  static LOGIN_SUCCESS = 'LOGIN_SUCCESS';
  loginSuccess():Action{
    return <Action>{
      type: NoteActions.LOGIN_SUCCESS
    };
  }

  static LOGIN_FAILED = 'LOGIN_FAILED';
  loginFailed():Action{
    return <Action>{
      type: NoteActions.LOGIN_FAILED
    };
  }*/

}
