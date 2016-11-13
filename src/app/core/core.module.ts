/**
 * Created by Artur_Nizamutdinov on 9/27/2016.
 */
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import {
  NgModule,
  Optional,
  SkipSelf
} from '@angular/core';

import { AppState } from './app-state.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  providers: [
    AppState
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
