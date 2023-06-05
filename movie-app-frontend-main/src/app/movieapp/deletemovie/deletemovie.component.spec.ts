import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeletemovieComponent } from './deletemovie.component';
import { of, throwError } from 'rxjs';
import { MovieService } from 'src/app/movie.service';
import { HttpClient,HttpClientModule,HttpHandler } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';

describe('DeletemovieComponent', () => {
  let component: DeletemovieComponent;
  let fixture: ComponentFixture<DeletemovieComponent>;
  let movieService: MovieService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DeletemovieComponent
      ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule
      ],
      providers:[MovieService,HttpClient,HttpHandler]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletemovieComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService);
    fixture.detectChanges();
  });

  it('should delete a movie', () => {
    const movieName = 'Example Movie';
    const response = { message: 'Movie deleted successfully' };

    spyOn(movieService, 'forDeletingAMovie').and.returnValue(of(response));

    component.movieName = movieName;
    component.deleteMovie();

    expect(component.message).toEqual(response.message);
    expect(movieService.forDeletingAMovie).toHaveBeenCalledWith(movieName);
  });

  it('should handle error when deleting a movie', () => {
    const movieName = 'Example Movie';
    const error = { error: 'Error deleting movie' };

    spyOn(movieService, 'forDeletingAMovie').and.returnValue(
      throwError(error)
    );

    component.movieName = movieName;
    component.deleteMovie();

    expect(component.message).toEqual(error.error);
  });
});

