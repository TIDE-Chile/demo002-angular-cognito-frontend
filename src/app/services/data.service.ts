import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

const baseAPIUrl = "https://v1mrz0lrs4.execute-api.us-east-1.amazonaws.com/Stage/";
@Injectable()
export class DataService {
  headers: any;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { 

  }

  evidence() {
    const subject = new Subject();
    this.auth.idToken.subscribe((token) => {
      this.headers = new HttpHeaders();
      //this.headers.set('Content-Type', 'application/json; charset=utf-8');
      this.headers = this.headers.append('Authorization', token);
      this.http.get(baseAPIUrl+'evidence', {headers:this.headers})
      .subscribe((d) => {
        subject.next(d['data'])
      });
      
    })
    return subject.asObservable();
  }

  profile() {
    const subject = new Subject();
    this.auth.idToken.subscribe((token) => {
      this.headers = new HttpHeaders();
      //this.headers.set('Content-Type', 'application/json; charset=utf-8');
      this.headers = this.headers.append('Authorization', token);
      this.http.get(baseAPIUrl+'profile', {headers:this.headers})
      .subscribe((d) => {
        subject.next(d)
      });
      
    })
    return subject.asObservable();
  }

  setProfile(profile) {
    const subject = new Subject();

    this.auth.idToken.subscribe((token) => {
      this.headers = new HttpHeaders();
      this.headers = this.headers.append('Authorization', token);
      this.http.post(baseAPIUrl+'profile',profile, {headers:this.headers})
      .subscribe((d) => {
        subject.next(d)
      });
    })

    return subject.asObservable();
  }

  echo() {
    return this.http.get(baseAPIUrl+'echo')

  }

}
