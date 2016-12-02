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

  private insideMasonry:boolean;
  private $masonryEl:any;

  constructor(private el:ElementRef) {
  }

  ngOnInit() {
    this.$masonryEl = jQuery(this.el.nativeElement).closest('[masonry-brick]');
    this.insideMasonry = this.$masonryEl.length > 0;
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
    let $elem = jQuery(this.el.nativeElement);
    let elemHeight = $elem.height();

    if (breakAnimation) {
      TweenMax.set($elem, {height: isCollapsed ? 0 : "auto"});
      return;
    }

    if (isCollapsed) {
      TweenMax.to($elem, 0.2, {height: 0});
    } else {
      TweenMax.set($elem, {height: "auto"});
      elemHeight = $elem.height();
      TweenMax.from($elem, 0.2, {height: 0});
    }

    if (this.insideMasonry) {
      if (isCollapsed) {
        this.$masonryEl.height(
          this.$masonryEl.height() - elemHeight
        );
      } else {
        this.$masonryEl.height(
          this.$masonryEl.height() + elemHeight
        );
      }
    }
  }
}
