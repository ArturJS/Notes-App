/**
 * Created by Artur_Nizamutdinov on 10/11/2016.
 */
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const angularModules = [
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  CommonModule,
  NgbModule
];

@NgModule({
  imports: angularModules,
  exports: angularModules
})
export class SharedImportsModule {
}
