/**
 * Created by Артур on 11.09.2016.
 */
export class User {
  public login : string;
  public password : string;

  constructor ({login, password}) {
    this.login = login;
    this.password = password;
  }
}
