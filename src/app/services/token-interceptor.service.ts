import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TokenInterceptor {

  constructor(
    private auth : AuthService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const subject :Subject<HttpEvent<any>> = new Subject();
    
    this.auth.idToken.subscribe(token => {
      request = request.clone({
        setHeaders: {
          Authorization: `${token}`
        }
      });
      return next.handle(request).subscribe(e => {
        subject.next(e);
      });
    })

    return subject.asObservable()
  }
}