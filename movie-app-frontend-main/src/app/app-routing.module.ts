import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './movieapp/login/login.component';
import { RegisterComponent } from './movieapp/register/register.component';
import { AllmoviesComponent } from './movieapp/allmovies/allmovies.component';
import { BookticketComponent } from './movieapp/bookticket/bookticket.component';
import { ResetpasswordComponent } from './movieapp/resetpassword/resetpassword.component';
import { DeletemovieComponent } from './movieapp/deletemovie/deletemovie.component';
import { BookingsComponent } from './movieapp/bookings/bookings.component';
import { UpdatestatusComponent } from './movieapp/updatestatus/updatestatus.component';
import { AuthGuard } from './auth.guard';
import { SearchmovieComponent } from './movieapp/searchmovie/searchmovie.component';

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'login',component:LoginComponent},
  {path:'home',component:AllmoviesComponent,canActivate:[AuthGuard]},
  {path:'register',component:RegisterComponent},
  {path:'bookticket',component:BookticketComponent,canActivate:[AuthGuard]},
  {path:'bookings',component:BookingsComponent,canActivate:[AuthGuard]},
  {path:'resetpassword',component:ResetpasswordComponent,canActivate:[AuthGuard]},
  {path:'deletemovie',component:DeletemovieComponent,canActivate:[AuthGuard]},
  {path:'updatestatus',component:UpdatestatusComponent,canActivate:[AuthGuard]},
  {path:'searchmovie',component:SearchmovieComponent,canActivate:[AuthGuard]},
  {path:'**',component:LoginComponent,canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
