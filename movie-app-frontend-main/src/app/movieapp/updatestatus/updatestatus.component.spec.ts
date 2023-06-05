import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UpdatestatusComponent } from './updatestatus.component';
import { HttpClient,HttpClientModule,HttpHandler } from '@angular/common/http';
import { MovieService } from 'src/app/movie.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('UpdatestatusComponent', () => {
  let component: UpdatestatusComponent;
  let fixture: ComponentFixture<UpdatestatusComponent>;
  let movieService: MovieService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports : [FormsModule],
      declarations: [UpdatestatusComponent],
      providers: [MovieService,HttpClient,HttpHandler],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatestatusComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService);
    spyOn(movieService, 'forUpdatingAMovie').and.returnValue(
      of({ message: 'Success' })
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the movieService and update the messages', () => {
    component.movie = {
      movieName: 'Dasara',
      theatreName: 'Miraj',
      noOfTicketsAvailable: 126,
      ticketsStatus: 'BOOK ASAP',
    }; // Set the movie property as required for the test
    component.onUpdate();
    expect(movieService.forUpdatingAMovie).toHaveBeenCalledWith(
      component.movie
    );
    expect(component.messages).toBe('Success');
  });
});
