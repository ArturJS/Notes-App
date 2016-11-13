/**
 * Created by Артур on 11.09.2016.
 */
import {Injectable} from '@angular/core';
import {CanLoad, Router} from '@angular/router';
import {AuthService} from '../shared/services';

@Injectable()
export class LoggedOutGuard implements CanLoad {
  constructor(private authService:AuthService,
              private router:Router) {
  }

  canLoad():boolean {
    var isLoggedOut = !this.authService.isLoggedIn();
    if (!isLoggedOut) {
      this.router.navigate(['/courses']);
    }
    return isLoggedOut;
  }
}
