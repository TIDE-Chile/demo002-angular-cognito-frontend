import {Routes} from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { AnotherPageComponent } from './views/another-page/another-page.component';

// import {MinorViewComponent} from "./minor-view/minor-view.component";

export const ROUTES: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'another_page', component: AnotherPageComponent },

    // App views

    // Handle all other routes
    {path: '**',    component: HomeComponent }
];



