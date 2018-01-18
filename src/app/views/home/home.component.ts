import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  myMessage: string;
  name = 'none';
  email = 'none';
  sub = 'none';
  userDataSubscription: Subscription;
  userData: boolean;
  isAuthorizedSubscription: Subscription;
  isAuthorized: boolean;

  constructor(
    private auth: AuthService,
  ) {
  }

  ngOnInit() {
    this.auth.idToken.subscribe((token) => {
      if (token) {
        let payload = token.split('.')[1];
        let jsonPayload = JSON.parse(atob(payload));
        var formatted = JSON.stringify(jsonPayload, null, 4);
        this.myMessage = formatted;
  
        this.name = jsonPayload['name'];
        this.email = jsonPayload['email'];
        this.sub = jsonPayload['sub'];
        this.isAuthorized = true;
      }
    })


  }

  ngOnDestroy(): void {
  }
}