import { Component, Input } from '@angular/core';

@Component({
  selector: 'loader',
  templateUrl: './loader.html',
  styleUrls: ['./loader.scss']
})
export class Loader {
  @Input() isActive: boolean = false;
}
