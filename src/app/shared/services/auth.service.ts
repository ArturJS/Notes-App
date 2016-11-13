/**
 * Created by Артур on 11.09.2016.
 */

import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {User} from '../entities/user';
import {Observable} from 'rxjs/Observable';
import {BaseApiUrl} from '../../environment';
import {HttpInterceptor} from './http-interceptor.service.ts';

@Injectable()
export class AuthService {
  static apiUrl:string = BaseApiUrl + 'login';
  static LOGIN_KEY:string = "userData";

  constructor(
    private http:HttpInterceptor
  ) { }

  doLogin(user: User):Observable<any> {
    return this.http
      .post(AuthService.apiUrl, user)
      .map(res => {
        let userData = res.json();
        localStorage.setItem(AuthService.LOGIN_KEY, JSON.stringify(userData));
        return new User(userData);
      });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem(AuthService.LOGIN_KEY));
  }

  doLogout() {
    localStorage.removeItem(AuthService.LOGIN_KEY);
  }

  isLoggedIn() {
    return !!localStorage.getItem(AuthService.LOGIN_KEY);
  }
}
