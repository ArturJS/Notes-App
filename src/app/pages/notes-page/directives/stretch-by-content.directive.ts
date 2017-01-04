import {
  Directive,
  ElementRef,
  OnChanges,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Directive({
  selector: '[stretch-by-content]'
})
export class StretchByContentDirective implements OnChanges {
  @Input('stretch-by-content') value;
  @Output()onContentUpdate:EventEmitter<any>;

  constructor(private el:ElementRef) {
    this.onContentUpdate = new EventEmitter<any>();
  }

  ngOnChanges() {
    setTimeout(()=>{
      this.updateHeight();
      this.onContentUpdate.emit();
    }, 0);
  }

  updateHeight() {
    let element = this.el.nativeElement;
    element.style.height = '0px';
    element.style.height = element.scrollHeight + 5 + 'px';
  }
}
