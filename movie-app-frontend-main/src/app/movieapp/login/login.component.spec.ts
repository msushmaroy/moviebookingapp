import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { HttpClient,HttpClientModule,HttpHandler } from '@angular/common/http';
import { MovieService } from 'src/app/movie.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let movieService: MovieService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LoginComponent
      ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule
      ],
      providers: [{ provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }]
    })
    .compileComponents();
    router = TestBed.inject(Router);
    movieService = TestBed.inject(MovieService);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the registration page', () => {
    component.onRegister();
    expect(router.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should login as guest and navigate to the home page', () => {
    component.onLoginAsGuest();
    expect(component.userStatus).toBe('guest');
    expect(sessionStorage.getItem('loginStatus')).toBe('guest');
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
  
});
