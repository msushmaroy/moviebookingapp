import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/movie.service';
import { Ticket } from '../models/Ticket';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  allTickets : Ticket[] = [];
  movieName : string = '';
  isFormSubmit : boolean = false;

  constructor(private movieService:MovieService) { }
  
  getAllTickets(){
    this.movieName = this.movieService.validateMovieName(this.movieName);
    this.isFormSubmit = true
    this.movieService.forGettingAllBookedTickets(this.movieName).subscribe(
      (result)=>{
        console.log(result);
        this.allTickets = result
      }
    ) 
  }

  ngOnInit(): void {
  }

}
