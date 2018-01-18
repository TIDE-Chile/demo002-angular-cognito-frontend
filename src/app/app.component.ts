import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  stringClaims: string;
  claims: object;
  title = 'TIDE';

  constructor(
    private auth: AuthService
  ) {
    auth.handleAuthentication();
  }

  ngOnInit() {
  }

}
