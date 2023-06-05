import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingsComponent } from './bookings.component';
import { of, throwError } from 'rxjs';
import { MovieService } from 'src/app/movie.service';
import { HttpClient,HttpClientModule,HttpHandler } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';

describe('BookingsComponent', () => {
  let component: BookingsComponent;
  let fixture: ComponentFixture<BookingsComponent>;
  let movieService: MovieService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingsComponent],
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
    fixture = TestBed.createComponent(BookingsComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should should get all tickets', () => {
    const movieName = 'Dasara'
    const allTickets = [{loginId: 'user',
      movieName : 'Dasara',
      theatreName : 'miraj',
      noOfTickets : 2,
      seatNumber : ['a1','a2']
    }]

    spyOn(movieService,'forGettingAllBookedTickets').and.returnValue(of(allTickets))

    component.allTickets = allTickets
    component.movieName = movieName;
    component.getAllTickets();

    expect(component.allTickets).toEqual(allTickets);
    expect(movieService.forGettingAllBookedTickets).toHaveBeenCalledWith(movieName);

  });

});
