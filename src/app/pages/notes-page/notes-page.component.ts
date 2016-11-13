import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {Component} from '@angular/core';

import {Router} from '@angular/router';

import {Store} from '@ngrx/store';
import {Actions} from "@ngrx/effects";

import {StoreService} from '../../shared/services';
import {AbstractSmartComponent} from '../../shared/components';

import {NotesActions} from './notes.actions.ts';
import {notesReducer} from './notes-page.reducer.ts';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

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
  private isEditingNote:any;

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
              af:AngularFire) {
    super(storeService, NotesPage.reducers);

    this.notesList = af.database.list('/todos');
    this.isEditingNote = {};

    this.newNoteForm = this.fb.group({
      title: ['', [
        Validators.required
      ]],
      description: ['', [
        Validators.required
      ]]
    });
  }

  addNote() {
    let newNote = Object.assign({id: Math.random()}, this.newNoteForm.value);
    this.notesList.push(newNote);
    this.newNoteForm.setValue({title:'', description: ''});
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

  onInit() {
  }

  onDestroy() {
  }
}
//instead of static constructor
NotesPage.initialize();//see also https://basarat.gitbooks.io/typescript/content/docs/tips/staticConstructor.html
