import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MovieService } from './movie.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './movieapp/login/login.component';
import { HomeComponent } from './movieapp/home/home.component';
import { RegisterComponent } from './movieapp/register/register.component';
import { BookingsComponent } from './movieapp/bookings/bookings.component';
import { BookticketComponent } from './movieapp/bookticket/bookticket.component';
import { AllmoviesComponent } from './movieapp/allmovies/allmovies.component';
import { ResetpasswordComponent } from './movieapp/resetpassword/resetpassword.component';
import { DeletemovieComponent } from './movieapp/deletemovie/deletemovie.component';
import { UpdatestatusComponent } from './movieapp/updatestatus/updatestatus.component';
import { SearchmovieComponent } from './movieapp/searchmovie/searchmovie.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    BookingsComponent,
    BookticketComponent,
    AllmoviesComponent,
    ResetpasswordComponent,
    DeletemovieComponent,
    UpdatestatusComponent,
    SearchmovieComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [MovieService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
