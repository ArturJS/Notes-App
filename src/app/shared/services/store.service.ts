/**
 * Created by Artur_Nizamutdinov on 10/18/2016.
 */
import { Injectable } from "@angular/core";
import { Store, combineReducers } from "@ngrx/store";

@Injectable()
export class StoreService {
  private static _reducers: any = {};

  constructor(private store: Store<any>) {
  }

  addReducers(reducers: any) {
    const reducerKeys = Object.keys(reducers);

    for (let key of reducerKeys) {
      StoreService._reducers[key] = reducers[key];
    }

    this.store.replaceReducer(combineReducers(StoreService._reducers));
  }
}
