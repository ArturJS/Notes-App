import {
  Component,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'login-popup',
  templateUrl: './login-popup.html',
  styleUrls: ['./login-popup.scss']
})
export class LoginPopup {
  @Output() public onLogin:EventEmitter<any>;

  constructor() {
    this.onLogin = new EventEmitter<any>();
  }

  login() {
    this.onLogin.emit();
  }
}
