import {
  inject,
  TestBed
} from '@angular/core/testing';

import {
  Component,
  ViewEncapsulation,
  ViewContainerRef
} from '@angular/core';

// Load the implementations that should be tested
import { App } from './app.component';
import { AppState } from './core/app-state.service';

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AppState,
      ViewContainerRef,
      App
    ]}));

  it('should have a name', inject([ App ], (app) => {
    expect(app.name).toEqual('Angular 2 Video Courses');
  }));

});
