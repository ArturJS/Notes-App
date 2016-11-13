/**
 * Created by Artur_Nizamutdinov on 9/29/2016.
 */
import {
  Http,
  Request,
  RequestOptions,
  RequestOptionsArgs,
  Response,
  Headers
} from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

@Injectable()
export class HttpInterceptor {

  constructor(
    private http: Http,
    private _router: Router
  ) {
  }

  private static onErrorsObservable:Subject<any> = new Subject<any>();

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(this.http.request(url, options));
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(this.http.get(url,options));
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(this.http.post(url, body, this.getRequestOptionArgs(options)));
  }

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(this.http.put(url, body, this.getRequestOptionArgs(options)));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(this.http.delete(url, options));
  }

  getRequestOptionArgs(options?: RequestOptionsArgs) : RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.append('Content-Type', 'application/json');
    return options;
  }

  public getOnErrorsObservable():Subject<any> {//todo remove (when ngrx/store is integrated)
    return HttpInterceptor.onErrorsObservable;
  }

  intercept(observable: Observable<Response>): Observable<Response> {
    return observable.catch((err, source) => {
      let statusText = err.statusText;
      let errorMessage = err._body;

      if (!(err.status === 401 && _.endsWith(err.url, 'api/login'))) {

        HttpInterceptor.onErrorsObservable.next({//todo dispatch action
          statusText: statusText,
          errorMessage: errorMessage
        });

      }
      return Observable.throw(err);
    });

  }
}
