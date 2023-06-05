import { Component, OnInit } from '@angular/core';
import { Movie } from '../models/Movie';
import { MovieService } from 'src/app/movie.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-updatestatus',
  templateUrl: './updatestatus.component.html',
  styleUrls: ['./updatestatus.component.css']
})
export class UpdatestatusComponent implements OnInit {

  ticketsStatus !: string ;

  movie : Movie = {
    movieName :'',
    theatreName :'',
    noOfTicketsAvailable :0 ,
    ticketsStatus :''
  }

  messages : string =""

  constructor(private movieService:MovieService) { }

  onUpdate(){
    this.movie.movieName = this.movieService.validateMovieName(this.movie.movieName)
    this.movie.theatreName = this.movieService.validateMovieName(this.movie.theatreName)
    this.movie.ticketsStatus = this.ticketsStatus;
    this.movieService.forUpdatingAMovie(this.movie).subscribe(
      (res)=>{
        console.log(res);
        this.messages = res.message;
      }
    )
    console.log(this.movie)
  }

  ngOnInit(): void {
  }

}
