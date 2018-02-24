import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { ROUTES } from './app.routes';
import { HomeComponent } from './views/home/home.component';
import { NavbarComponent } from './views/navbar/navbar.component';
import { AnotherPageComponent } from './views/another-page/another-page.component';
import { DataService } from './services/data.service';
import { TokenInterceptor } from './services/token-interceptor.service';
import { FileDropModule } from "ngx-file-drop";
import { FlexichartComponent } from './views/flexichart/flexichart.component';
import { FlexiDataService } from './services/flexi-data.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    AnotherPageComponent,
    FlexichartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(ROUTES),
    MDBBootstrapModule.forRoot(),
    FileDropModule
  ],
  providers: [
    AuthService,
    DataService,
    FlexiDataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
