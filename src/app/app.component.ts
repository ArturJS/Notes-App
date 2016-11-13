/*
 * Angular 2 decorators and services
 */
import {
  Component,
  ViewEncapsulation,
  ViewContainerRef
} from '@angular/core';

import { AppState } from './core';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.style.scss'
  ],
  templateUrl: './app.component.html'
})
export class App {

  name = 'Angular 2 Video Courses';

  constructor(
    public appState: AppState,
    private viewContainerRef:ViewContainerRef
  ) {}

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}
