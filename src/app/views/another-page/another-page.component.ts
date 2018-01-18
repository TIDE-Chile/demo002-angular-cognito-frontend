import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-another-page',
  templateUrl: './another-page.component.html',
  styleUrls: ['./another-page.component.scss']
})
export class AnotherPageComponent implements OnInit {
  claims: any;

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.claims.subscribe((claims) => {
      this.claims = claims;
    })
  }

}
