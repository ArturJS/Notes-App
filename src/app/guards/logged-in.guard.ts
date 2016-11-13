/**
 * Created by Артур on 11.09.2016.
 */
import {Injectable} from '@angular/core';
import {CanLoad, Router} from '@angular/router';
import {AuthService} from '../shared/services';

@Injectable()
export class LoggedInGuard implements CanLoad {
  constructor(private authService:AuthService,
              private router:Router) {
  }

  canLoad():boolean {
    var isLoggedIn = this.authService.isLoggedIn();
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    }
    return isLoggedIn;
  }
}
