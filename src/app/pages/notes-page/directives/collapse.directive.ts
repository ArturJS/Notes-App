import {
  Directive,
  ElementRef,
  SimpleChanges,
  Input
} from '@angular/core';

@Directive({
  selector: '[collapse]'
})
export class CollapseDirective {
  @Input() isCollapsed:boolean;

  constructor(private el:ElementRef) {
  }

  ngOnChanges(changes:SimpleChanges) {
    let elem = this.el.nativeElement;
    let breakAnimation = !elem.classList.contains('collapse-initialized');

    if (breakAnimation) {
      elem.classList.add('collapse-initialized');
    }
    
    this.toggleCollapse(changes['isCollapsed'].currentValue, breakAnimation);
  }

  toggleCollapse(isCollapsed, breakAnimation) {
    let elem = this.el.nativeElement;

    if (breakAnimation) {
      TweenMax.set(elem, {height: isCollapsed ? 0 : "auto"});
      return;
    }

    if (isCollapsed) {
      TweenMax.to(elem, 0.2, {height: 0});
    } else {
      TweenMax.set(elem, {height: "auto"});
      TweenMax.from(elem, 0.2, {height: 0});
    }
  }
}
