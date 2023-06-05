import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { MovieService } from 'src/app/movie.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AllmoviesComponent } from './allmovies.component';

describe('AllmoviesComponent', () => {
  let component: AllmoviesComponent;
  let fixture: ComponentFixture<AllmoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AllmoviesComponent
      ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        RouterTestingModule
      ],
      providers:[MovieService]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(AllmoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check status color to be green', () => {
    console.log(component.getStatusColor('SOLD OUT'))
    expect(component.getStatusColor('BOOK ASAP')).toBe('green');
  })

  it('should check status color to be red', () => {
    console.log(component.getStatusColor('SOLD OUT'))
    expect(component.getStatusColor('SOLD OUT')).toBe('red');
  })

  it('should check weather logged as user', () => {
    sessionStorage.setItem('loginStatus','user');
    expect(component.isLoggedAsUser()).toBeTruthy();
    sessionStorage.clear();
    expect(component.isLoggedAsUser()).toBeFalsy();
  })

  it('sholud return path', () => {
    expect(component.getMovieImagePath('Dasara')).toBe('../../../assets/images/movies/Dasara.jpg');
    expect(component.getMovieImagePath('Balagam')).toBe('../../../assets/images/movies/Balagam.jpg');
    expect(component.getMovieImagePath('Bhoola')).toBe('../../../assets/images/movies/Bhoola.jpg');
    expect(component.getMovieImagePath('Vidudhala')).toBe('../../../assets/images/movies/Vidudhala.jpg');
    expect(component.getMovieImagePath('Pathaan')).toBe('../../../assets/images/movies/Pathaan.jpg');
    expect(component.getMovieImagePath('Pushpa')).toBe('../../../assets/images/movies/Pushpa.jpg');
    expect(component.getMovieImagePath('InvalidMovie')).toBe('');
  })
});
