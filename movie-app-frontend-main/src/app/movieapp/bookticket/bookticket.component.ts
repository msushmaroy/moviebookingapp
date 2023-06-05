import { Component, OnInit } from '@angular/core';
import { Ticket } from '../models/Ticket';
import { MovieService } from 'src/app/movie.service';
import { NgForm } from '@angular/forms';

interface Seat {
  number: string;
  selected: boolean;
}

interface SeatRow {
  seats: Seat[];
}

@Component({
  selector: 'app-bookticket',
  templateUrl: './bookticket.component.html',
  styleUrls: ['./bookticket.component.css'],
})
export class BookticketComponent implements OnInit {
  rows: SeatRow[] = [];
  selectedSeats: Seat[] = [];

  loginStatus: string = '';
  loggedInAsGuest: boolean = false;
  loggedInAsAdmin: boolean = false;
  loggedInAsUser: boolean = false;

  booking: Ticket = {
    loginId: '',
    movieName: '',
    theatreName: '',
    noOfTickets: 0,
    seatNumber: [],
  };
  seatNumbers: string = '';
  message: string = '';
  noOfTickets: any;

  constructor(private movieService: MovieService) {
    if (movieService.getMovieName().length > 0) {
      this.booking.movieName = movieService.getMovieName();
      this.booking.theatreName = movieService.getMovieTheatre();
      movieService.setMovieName('');
      movieService.setMovieTheatre('');
    }
  }

  submitBookingForm() {
    this.booking.movieName = this.movieService.validateMovieName(this.booking.movieName);
    this.booking.theatreName = this.movieService.validateMovieName(this.booking.theatreName);
    this.booking.noOfTickets = this.noOfTickets;
    this.booking.seatNumber = this.seatNumbers.split(/\s+/);
    if(this.booking.seatNumber.length < this.booking.noOfTickets){
      this.message = "seats cannot be less than " + this.booking.noOfTickets;
    }
    else if (this.booking.seatNumber.length > this.booking.noOfTickets) {
      this.message = "Can't book more than " + this.booking.noOfTickets;
    } else if (this.checkForDuplicates(this.booking.seatNumber)) {
      this.message = 'Check for duplicate seats';
    } else {
      this.movieService.bookTickets(this.booking).subscribe(
        (res) => {
          console.log(res);
          if (res.message === '"All tickets sold out"') {
            this.message = "Requested tickets are more than available.";
          } else {
            this.message = 'Booking Success';
          }
        },
        (err) => {
          console.log(err);
          if (err.status === 404) {
            this.message = err.error;
          } else {
            this.message = 'No movies available';
          }
        }
      );
    }
  }

  checkForDuplicates(array: string[]): boolean {
    return new Set(array).size !== array.length;
  }

  ngOnInit(): void {
    this.booking.loginId =
      this.booking.loginId + sessionStorage.getItem('loginId');
    console.log(sessionStorage.getItem('loginStatus'));
    if (sessionStorage.getItem('loginStatus') === 'guest') {
      this.loggedInAsGuest = true;
    } else if (sessionStorage.getItem('loginStatus') === 'admin') {
      this.loggedInAsAdmin = true;
    } else if (sessionStorage.getItem('loginStatus') === 'user') {
      this.loggedInAsUser = true;
    }
  }
}
