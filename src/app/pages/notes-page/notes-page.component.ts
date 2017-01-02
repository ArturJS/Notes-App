import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  Component,
  ViewChild
} from '@angular/core';

import {Router} from '@angular/router';

import {Store} from '@ngrx/store';
import {Actions} from "@ngrx/effects";

import {StoreService} from '../../shared/services';
import {AbstractSmartComponent} from '../../shared/components';

import {NotesActions} from './notes.actions.ts';
import {notesReducer} from './notes-page.reducer.ts';
import {
  AngularFire,
  FirebaseListObservable,
  FirebaseObjectObservable,
  AuthProviders,
  AuthMethods
} from 'angularfire2';

import {AngularMasonry} from 'angular2-masonry';

import * as _ from 'lodash';

@Component({
  selector: 'notes-page',
  templateUrl: './notes-page.html',
  styleUrls: ['./notes-page.scss']
})
export class NotesPage extends AbstractSmartComponent {
  private newNoteForm:FormGroup;
  private static reducers:any;
  private notesList:FirebaseListObservable<any[]>;
  private userSettings:FirebaseObjectObservable<any[]>;
  private isEditingNote:any;
  private auth:any;

  @ViewChild('masonryContainer') private masonryCnt:AngularMasonry;

  static initialize() {
    NotesPage.reducers = {
      note: notesReducer
    };
  }

  constructor(private fb:FormBuilder,
              private router:Router,
              private store:Store<any>,
              private storeService:StoreService,
              private noteActions:NotesActions,
              private actions$:Actions,
              private af:AngularFire) {
    super(storeService, NotesPage.reducers);


    this.isEditingNote = {};

    this.newNoteForm = this.fb.group({
      title: ['', [
        Validators.required
      ]],
      description: ['', [
        Validators.required
      ]]
    });

    this.af.auth.subscribe(auth => {
      this.auth = auth;

      if (!auth) return;

      this.notesList = this.af.database.list('users/' + auth.uid + '/notes');
      this.userSettings = this.af.database.object('users/' + auth.uid + '/settings');
    });
  }

  login() {
    this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup,
    });
  }

  logout() {
    this.af.auth.logout();
  }

  addNote() {
    let newNote = Object.assign({id: Math.random()}, this.newNoteForm.value);
    this.notesList.push(newNote);
    this.newNoteForm.setValue({title: '', description: ''});
  }

  removeNote(note) {
    this.notesList.remove(note.$key);
  }

  editNote(note) {
    this.isEditingNote[note.id] = true;
  }

  saveNote(note) {
    this.isEditingNote[note.id] = false;
    this.notesList.update(note.$key, _.pick(note, ['id', 'title', 'description']));
  }

  updateLayout() {
    this.masonryCnt.layout();
  }

  onInit() {
  }

  onDestroy() {
  }
}
//instead of static constructor
NotesPage.initialize();//see also https://basarat.gitbooks.io/typescript/content/docs/tips/staticConstructor.html
