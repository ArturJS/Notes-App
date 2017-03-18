/**
 * Created by Artur_Nizamutdinov on 10/12/2016.
 */
import {OnInit, OnDestroy} from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { StoreService } from '../services';
import * as lodash from 'lodash';

let _:any = lodash;

export abstract class AbstractSmartComponent implements OnInit, OnDestroy {
  private namelessSubscriptions:Subscription[] = [];
  private namedSubscriptions:any = {};
  public error:any;

  constructor(private _storeService?: StoreService,
              private _reducers?:any) {
  }

  ngOnInit():void {
    if (this._storeService) {
      this._storeService.addReducers(this._reducers);
    }
    this.onInit();
  }

  ngOnDestroy():void {
    this._unsubscribeAll();
    this.onDestroy();
  }

  protected _subscribe(subscription:Subscription|Subscription[], subscriptionName?:string):void {
    if (subscription instanceof Array) {
      this.namelessSubscriptions.push(...subscription);
    } else if (!subscriptionName && subscription instanceof Subscription) {
      this.namelessSubscriptions.push(subscription);
    } else {
      this._unsubscribe(subscriptionName);
      this.namedSubscriptions[subscriptionName] = subscription;
    }
  }

  protected _unsubscribe(subscriptionName:string):void {
    let subscription:any = this.namedSubscriptions[subscriptionName];
    subscription && subscription.unsubscribe();
  }

  protected _unsubscribeAll():void {

    _.each(this.namelessSubscriptions, (sub) => {
      sub.unsubscribe();
    });

    _.each(this.namedSubscriptions, (sub)=>{
      sub.unsubscribe();
    });

    this.namedSubscriptions = null;
    this.namelessSubscriptions.splice(0, this.namelessSubscriptions.length);
  }

  abstract onInit();
  abstract onDestroy();
}
