import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  Component,
  ViewChild, ErrorHandler
} from '@angular/core';

import {AbstractSmartComponent} from '../../shared/components';

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
  public newNoteForm: FormGroup;
  public notesList: FirebaseListObservable<any[]>;
  public userSettings: FirebaseObjectObservable<any[]>;
  public isEditingNote: any;
  public auth: any;
  public isLoggingIn: boolean;

  @ViewChild('masonryContainer') public masonryCnt: AngularMasonry;

  constructor(private fb: FormBuilder,
              private af: AngularFire,
              private errorHandler: ErrorHandler) {
    super();

    this.isLoggingIn = true;
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

  onInit() {
    this._subscribe([
      this.af.auth.subscribe(auth => {
        this.auth = auth;
        this.isLoggingIn = false;

        if (!auth) return;

        this.notesList = this.af.database.list('users/' + auth.uid + '/notes');
        this.userSettings = this.af.database.object('users/' + auth.uid + '/settings');
      })
    ]);

    this._subscribe([
      (this.errorHandler as any).getObservable()
        .subscribe((error) => {
          const el = document.querySelector('pre');
          el.className = '';
          el.innerHTML = error;
        })
    ]);
  }

  onDestroy() {
  }

  throwError() {
    throw new Error('Error description');
  }

  trackFbObjects(index, obj) {
    return obj.$key;
  }

  login() {
    this.isLoggingIn = true;

    this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Redirect,
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
}
