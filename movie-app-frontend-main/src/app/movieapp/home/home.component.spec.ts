import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { HttpClient,HttpClientModule,HttpHandler } from '@angular/common/http';
import { MovieService } from 'src/app/movie.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent
      ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule
      ],
      providers:[MovieService,HttpClient,HttpHandler,RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /register when loginForGuest is called', () => {
    const routerSpy = spyOn(component.router, 'navigate');
    component.loginForGuest();
    expect(routerSpy).toHaveBeenCalledWith(['/register']);
  });

  it('should return false for getUserStatus when logged in as guest or user', () => {
    sessionStorage.setItem('loginStatus', 'guest');
    fixture.detectChanges();
    expect(component.getUserStatus()).toBe(false);

    sessionStorage.setItem('loginStatus', 'user');
    fixture.detectChanges();
    expect(component.getUserStatus()).toBe(false);
  });

  it('should return true for getUserStatus when not logged in as guest or user', () => {
    sessionStorage.setItem('loginStatus', 'admin');
    fixture.detectChanges();
    expect(component.getUserStatus()).toBe(true);

    sessionStorage.removeItem('loginStatus');
    fixture.detectChanges();
    expect(component.getUserStatus()).toBe(true);
  });

  it('should return true for isLoggedInAsUser when logged in as user', () => {
    sessionStorage.setItem('loginStatus', 'user');
    fixture.detectChanges();
    expect(component.isLoggedInAsUser()).toBe(true);
  });

  it('should return false for isLoggedInAsUser when not logged in as user', () => {
    sessionStorage.setItem('loginStatus', 'guest');
    fixture.detectChanges();
    expect(component.isLoggedInAsUser()).toBe(false);

    sessionStorage.setItem('loginStatus', 'admin');
    fixture.detectChanges();
    expect(component.isLoggedInAsUser()).toBe(false);
  });

  it('should return true for getStatusForLogout when logged in as user or admin', () => {
    sessionStorage.setItem('loginStatus', 'user');
    fixture.detectChanges();
    expect(component.getStatusForLogout()).toBe(true);

    sessionStorage.setItem('loginStatus', 'admin');
    fixture.detectChanges();
    expect(component.getStatusForLogout()).toBe(true);
  });

  it('should return false for getStatusForLogout when not logged in as user or admin', () => {
    sessionStorage.setItem('loginStatus', 'guest');
    fixture.detectChanges();
    expect(component.getStatusForLogout()).toBe(false);

    sessionStorage.removeItem('loginStatus');
    fixture.detectChanges();
    expect(component.getStatusForLogout()).toBe(false);
  });
});
