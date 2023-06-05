import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { MovieService } from 'src/app/movie.service';
import { SearchmovieComponent } from './searchmovie.component';
import { HttpClient,HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';

describe('SearchmovieComponent', () => {
  let component: SearchmovieComponent;
  let fixture: ComponentFixture<SearchmovieComponent>;
  let movieService: MovieService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [SearchmovieComponent],
      providers: [MovieService, HttpClient, HttpHandler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchmovieComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    movieService = TestBed.inject(MovieService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.searchForm.valid).toBeFalsy();
  });

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
