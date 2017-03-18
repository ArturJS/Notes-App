import {Injectable, ErrorHandler} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class EnhancedErrorHandlerService extends ErrorHandler {
  private error$ : Subject<any> = new Subject<any>();

  constructor() {
    super(true);
  }

  handleError(error) {
    this.error$.next(error);
    super.handleError(error);
  }

  getObservable() {
    return this.error$;
  }
}
