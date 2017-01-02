import {
  Directive,
  ElementRef,
  OnChanges,
  Input
} from '@angular/core';

@Directive({
  selector: '[stretch-by-content]'
})
export class StretchByContentDirective implements OnChanges {
  @Input('stretch-by-content') value;

  constructor(private el:ElementRef) {
  }

  ngOnChanges() {
    setTimeout(()=>{
      this.updateHeight();
    }, 0);
  }

  updateHeight() {
    let element = this.el.nativeElement;
    element.style.height = '0px';
    element.style.height = element.scrollHeight + 5 + 'px';
  }
}
