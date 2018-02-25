import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import { COGNITO_CONFIG } from '../cognito_auth_config';
import { RouteConfigLoadStart } from '@angular/router/src/events';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const AWS = require('aws-sdk');

export class AuthConfig {
  constructor(
    public readonly clientId: string,
    public readonly domain: string,
    private router: Router
  ) {}
}

@Injectable()
export class AuthService {
  private auth: CognitoAuth;
  
  sessionSubject = new BehaviorSubject(null);
  sessionObservable = this.sessionSubject.asObservable();

  idTokenSubject = new BehaviorSubject(null);
  idToken = this.idTokenSubject.asObservable();

  accessTokenSubject = new BehaviorSubject(null);
  accessToken = this.accessTokenSubject.asObservable();

  claimsSubject = new BehaviorSubject(null);
  claims = this.claimsSubject.asObservable();

  myUrl = window.location.href;
  
  cognitoAuthConfig = {
    ClientId: COGNITO_CONFIG.ClientId,
    AppWebDomain: COGNITO_CONFIG.AppWebDomain,
    TokenScopesArray: COGNITO_CONFIG.TokenScopesArray,
    // RedirectUriSignIn: COGNITO_CONFIG.RedirectUriSignIn,
    // RedirectUriSignOut: COGNITO_CONFIG.RedirectUriSignOut,
    RedirectUriSignIn: this.myUrl,
    RedirectUriSignOut: this.myUrl,
    IdentityProvider: null, // 'Google' | 'Facebook'
    UserPoolId : COGNITO_CONFIG.UserPoolId,
    AdvancedSecurityDataCollectionFlag: false
  }

  constructor(
    private router:Router
  ) {
    alert(this.myUrl);
    this.initAuth();

    this.sessionObservable.subscribe((session) => {
      this.session = session;

      if (session) {
        const idToken = this.session.getIdToken().getJwtToken();
        const accessToken = this.session.getAccessToken().getJwtToken();
        const payload = JSON.parse(atob(idToken.split('.')[1]))

        this.idTokenSubject.next(idToken);
        this.accessTokenSubject.next(accessToken);
        this.claimsSubject.next(payload);

        console.log('Successfully logged!');
      }
    })
  }

  initAuth(provider?: string) {
    this.cognitoAuthConfig.IdentityProvider = provider ? provider : null;
    
    this.auth = new CognitoAuth(this.cognitoAuthConfig);
    this.auth.userhandler = {
        onSuccess: session => this.onSuccess(session),
        onFailure: () => this.onFailure(),
    };
  }
 
  // have to construct callbackUrl from "scratch",
  // as Angular doesn't appear to offer a native way to do it;
  // '/login' is my callback route
  private get callbackUrl() {
    return window.location.href.split('/').slice(0, 3).concat('login').join('/');
    // or window.location.origin + '/login';
  }
  
  // gets called by the callback component
  login(provider?:string) {

    if (provider) {
        this.initAuth(provider);
    } else {
        this.initAuth();
    }
    
    // this.auth.parseCognitoWebResponse(this.router.url);
    this.guardedUrl = window.location.pathname;
    this.auth.parseCognitoWebResponse(this.guardedUrl);
    this.auth.getSession();

  }

  logout() {
    this.auth.signOut();
  }


  // used to determine access in AuthGuard
  isAuthenticated() {
    return this.session && this.session.isValid();
  }

  private session;

  private onSuccess(session) {
    this.router.navigateByUrl(this.guardedUrl);
    this.sessionSubject.next(session);
    return session;
  }

  private onFailure() {
    this.session = undefined;
  }


  set guardedUrl(url: string) {
    localStorage.setItem('guardedUrl', url);
  }

  get guardedUrl() {
    return localStorage.getItem('guardedUrl') || '/';
  }

  public handleAuthentication(): void {
    var curUrl = window.location.href;
    this.guardedUrl = window.location.pathname;
    this.auth.parseCognitoWebResponse(curUrl);
    this.auth.getSession();
  }

}