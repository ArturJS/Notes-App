import {
  Directive,
  ElementRef,
  HostListener,
  OnInit
} from '@angular/core';

@Directive({
  selector: '[stretch-by-content]'
})
export class StretchByContentDirective implements OnInit {
  constructor(private el:ElementRef) {
  }

  ngOnInit():void {
    this.updateHeight();
  }

  @HostListener('input') updateHeight() {
    let element = this.el.nativeElement;
    element.style.height = '0px';
    element.style.height = element.scrollHeight + 5 + 'px';
  }
}
