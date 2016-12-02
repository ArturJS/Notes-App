import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import * as _ from 'lodash';

@Component({
  selector: 'note',
  templateUrl: './note.html',
  styleUrls: ['./note.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Note {
  @Input() public isEditingNote:boolean;
  @Input() public note:any;

  @Output() public onEdit:EventEmitter<any>;
  @Output() public onRemove:EventEmitter<any>;
  @Output() public onSave:EventEmitter<any>;
  @Output() public onUpdateLayout:EventEmitter<any>;

  private noteForm:FormGroup;
  private isCollapsed: boolean;

  constructor(private fb:FormBuilder,
              private el:ElementRef) {

    this.onEdit = new EventEmitter<any>();
    this.onRemove = new EventEmitter<any>();
    this.onSave = new EventEmitter<any>();
    this.onUpdateLayout = new EventEmitter<any>();

    this.noteForm = this.fb.group({
      title: ['', [
        Validators.required
      ]],
      description: ['', [
        Validators.required
      ]]
    });

    this.isCollapsed = false;
  }

  ngOnInit():void {
  }

  editNote(note) {
    this.onEdit.emit(note);
    this.noteForm.setValue({
      title: note.title,
      description: note.description
    });

    this.onUpdateLayout.emit();
  }

  removeNote(note) {
    this.onRemove.emit(note);
  }

  saveNote(note) {
    note = Object.assign(note, this.noteForm.getRawValue());
    this.onSave.emit(note);

    this.onUpdateLayout.emit();
  }

  linksFormatter(text:string) {
    let linkRegexp = /(http[^\s]+)/g;
    text = _.escape(text);
    return text.replace(linkRegexp, `<a href="$1" target="_blank" rel="nofollow noopener" style="color: #fff;">$1</a>`);
  }

  toggleCollapse(){
    this.isCollapsed = !this.isCollapsed;

    this.onUpdateLayout.emit();
  }
}
