/**
 * Created by Artur_Nizamutdinov on 10/19/2016.
 */

import { ActionReducer, Action } from '@ngrx/store';
import { NotesActions } from './notes.actions.ts';

/*const {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILED
} = NoteActions;*/

const initialState: any = {};

export const notesReducer:ActionReducer<any> = (store:Object=initialState, action:Action) => {
  let payload = action.payload;

  switch (action.type) {
    /*case LOGIN:
      return Object.assign({}, store, {
        userData: new User(payload),
        isWrongCredentials: false
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, store, {
        isLoggedIn: true,
        isWrongCredentials: false
      });
    case LOGIN_FAILED:
      return Object.assign({}, store, {isWrongCredentials: true});*/

    default:
      return store;
  }
};
