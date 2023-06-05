import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/movie.service';
import { LoginRequest } from '../models/LoginRequest';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  
  loggedInAsGuest : boolean = false;
  loginId : any = "";
  password : string ="";
  
  updtaedLoginRequest : LoginRequest = {
    loginId: "",
    password: "",
  }

  message :string = ""

  constructor(private movieService:MovieService) {
    this.loginId = sessionStorage.getItem('loginId');
  }

  updatePassword(){
    this.updtaedLoginRequest.loginId = this.loginId;
    this.updtaedLoginRequest.password = this.password;
    this.movieService.forgetPassword(this.updtaedLoginRequest).subscribe(
      (res)=>{
        console.log(res.message);
        if(res.message === "Users password changed successfully"){
          this.message = "Password changed successfully"
        }
      }
    )
  }

  ngOnInit(): void {
    if(sessionStorage.getItem('loginStatus') === 'guest') {
      this.loggedInAsGuest = true;
    }
  }

}
