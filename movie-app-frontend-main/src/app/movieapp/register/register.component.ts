import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { User } from '../models/User';
import { MovieService } from 'src/app/movie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  f : FormGroup;

  contactNumber: number | any;

  message : string = "";

  confirmPassword : string = "";

  user : User = {
    loginId : "",
    firstName : "",
    lastName : "",
    email : "",
    contactNumber : 0,
    roles : ["user"],
    password : "",
  }


  constructor(private fb: FormBuilder,private movieService:MovieService, private router:Router) {
    this.f = this.fb.group({
      loginId : ['',Validators.required],
      firstName : ['',Validators.required],
      lastName : ['',Validators.required],
      email : ['',Validators.required],
      contactNumber : ['',Validators.required],
      password : ['',Validators.required]
    });
  }

  onSubmit() {
    // handle form submission here
    this.user.contactNumber = this.contactNumber;
    this.movieService.registerAUser(this.user).subscribe(
      (response) => {
        window.alert("User registration successful, Please login");
        this.router.navigate(['/login']);
      },
      (err) => {
        console.log(err)
        console.log(err.error)
        if(JSON.parse(err.error).message === "Error: LoginId is already taken!"){
          this.message = "LoginId is already taken!"
        }
        else if(JSON.parse(err.error).message === "Error: Email is already in use!"){
          this.message = "Email is taken!";
        }
      }
    )
  }


  ngOnInit(): void {
  }

}
