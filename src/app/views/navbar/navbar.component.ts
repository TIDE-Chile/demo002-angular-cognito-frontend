import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  email: any;
  name: any;

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.claims.subscribe((claims) => {
      this.name = claims['name'];
      this.email = claims['email'];
    })
  }

}
