/**
 * Created by Artur_Nizamutdinov on 10/11/2016.
 */
import { NgModule } from '@angular/core';

import { SharedImportsModule } from './shared-imports.module';
import { SharedComponentsModule } from './components/shared-components.module';

import * as services from './services';

const sharedModules = [
  SharedImportsModule,
  SharedComponentsModule
];

function toArray(obj):Array<any> {
  return Object.keys(obj).map(k => obj[k]);
}

@NgModule({
  imports: [
    ...sharedModules
  ],
  exports: [
    ...sharedModules
  ],
  providers: [
    ...toArray(services)
  ]
})
export class SharedModule {
}
