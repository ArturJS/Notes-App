/**
 * Created by Artur_Nizamutdinov on 10/11/2016.
 */
import { NgModule } from '@angular/core';
import { SharedImportsModule } from './../shared-imports.module';
import { Loader } from './loader';

@NgModule({
  imports: [
    SharedImportsModule
  ],
  exports: [
    Loader
  ],
  declarations: [
    Loader
  ]
})
export class SharedComponentsModule {
}
