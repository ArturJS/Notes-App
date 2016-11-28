/**
 * Created by Artur_Nizamutdinov on 10/11/2016.
 */
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MasonryModule } from 'angular2-masonry';

const angularModules = [
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  CommonModule,
  NgbModule,
  MasonryModule
];

@NgModule({
  imports: angularModules,
  exports: angularModules
})
export class SharedImportsModule {
}
