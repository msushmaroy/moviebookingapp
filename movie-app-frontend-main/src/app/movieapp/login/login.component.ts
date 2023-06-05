import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from 'src/app/movie.service';
import { LoginRequest } from '../models/LoginRequest';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  message : string = "";

  loginId: string = "";
  password: string = "";

  loginRequest: LoginRequest = {
    loginId : "",
    password : ""
  }

  userStatus: string = "";
  token: string = "";

  constructor(private fb: FormBuilder,private movieService: MovieService,private router:Router) {
    this.loginForm = this.fb.group({
      loginId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    // handle login form submission here
    this.loginRequest.loginId = this.loginId;
    this.loginRequest.password = this.password;
    sessionStorage.setItem('loginId', this.loginId);
    this.movieService.login(this.loginRequest).subscribe(
      (response)=>{
        sessionStorage.setItem('token',response.accessToken);
        console.log(response)
        if(response.roles[0] === 'ROLE_USER'){
          sessionStorage.setItem('loginStatus', 'user')
          this.userStatus = 'user'
        }
        else if(response.roles[0] === 'ROLE_ADMIN'){
          sessionStorage.setItem('loginStatus', 'admin')
          this.userStatus = 'admin'
        }
        this.router.navigate(['/home']);
      },
      (error)=>{
        console.log(error);
        this.message = "Invalid Credentials!!!";
      }
    )
  }

  onRegister() {
    // navigate to registration page here
    this.router.navigate(['/register']);
  }

  onLoginAsGuest() {
    // handle login as guest here
    this.userStatus = 'guest'
    sessionStorage.setItem('loginStatus', 'guest');
    this.router.navigate(['/home']);
  }

  ngOnInit(): void {
  }
}
