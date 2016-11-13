/**
 * Created by Artur_Nizamutdinov on 10/10/2016.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class Helpers {
  constructor(){}

  copyField(destObj, sourceObj, fieldName){
    for (let propName in sourceObj) {
      if (sourceObj.hasOwnProperty(propName) &&
          destObj.hasOwnProperty(propName) &&
          sourceObj[propName].hasOwnProperty(fieldName)) {

        destObj[propName][fieldName] = sourceObj[propName][fieldName]
      }
    }
  }


}
