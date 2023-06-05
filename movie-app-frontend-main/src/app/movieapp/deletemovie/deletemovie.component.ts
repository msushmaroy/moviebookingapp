import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/movie.service';

@Component({
  selector: 'app-deletemovie',
  templateUrl: './deletemovie.component.html',
  styleUrls: ['./deletemovie.component.css']
})
export class DeletemovieComponent implements OnInit {

  movieName : string = '';
  message :string = '';

  constructor(private movieService:MovieService) { }

  deleteMovie(){
    this.movieName = this.movieService.validateMovieName(this.movieName);
    this.movieService.forDeletingAMovie(this.movieName).subscribe(
      (response)=>{
        console.log(response)
        if(response.message === "Movie deleted successfully"){
          this.message = response.message
        }
      },(err)=>{
        console.log(err)
        this.message = err.error;
      }
    )
  }

  ngOnInit(): void {
  }

}
