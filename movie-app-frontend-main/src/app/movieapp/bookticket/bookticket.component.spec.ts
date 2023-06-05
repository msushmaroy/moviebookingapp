import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookticketComponent } from './bookticket.component';
import { HttpClient,HttpClientModule,HttpHandler } from '@angular/common/http';
import { MovieService } from 'src/app/movie.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { of } from 'rxjs';

describe('BookticketComponent', () => {
  let component: BookticketComponent;
  let fixture: ComponentFixture<BookticketComponent>;
  let array : string[] = ['a1', 'a2', 'a3', 'a4', 'a1'];
  let movieService: MovieService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BookticketComponent
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
    fixture = TestBed.createComponent(BookticketComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should validate", ()=>{
    expect(component.checkForDuplicates(array)).toBe(true);
  })

  it("should submit the form", ()=>{
    const bookingForm = {
      loginId: 'user',
      movieName : 'Dasara',
      theatreName : 'miraj',
      noOfTickets : 2,
      seatNumber : ['a1','a2']
    }
    const response = { message: 'Booking Success' };

    spyOn(movieService,'bookTickets').and.returnValue(of(response));

    component.booking = bookingForm;
    component.submitBookingForm();

    expect(component.message).toEqual(response.message);
    expect(movieService.bookTickets).toHaveBeenCalledWith(bookingForm);
  });
});
