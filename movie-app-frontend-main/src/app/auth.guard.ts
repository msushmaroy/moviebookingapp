import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MovieService } from './movie.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private movieService:MovieService,private router:Router){}

  canActivate(): boolean{

    if(this.movieService.isAuthenticated()){
      return true;
    }
    else{
      this.router.navigate(['login'])
      return false; 
    }
      
  }

}