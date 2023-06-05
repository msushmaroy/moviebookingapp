export interface Movie {
  _id?: {
    timestamp: number,
    date: string
  },
  movieName: string,
  theatreName: string,
  noOfTicketsAvailable: number,
  ticketsStatus: string
}

// export class MovieImpl implements Movie {
//   _id?: {
//     timestamp: number,
//     date: string
//   };
//   movieName: string;
//   theatreName: string;
//   noOfTicketsAvailable: number;
//   ticketsStatus: string;

//   constructor({ movieName, theatreName, noOfTicketsAvailable, ticketsStatus }: Omit<Movie, '_id'>) {
//     this.movieName = movieName;
//     this.theatreName = theatreName;
//     this.noOfTicketsAvailable = noOfTicketsAvailable;
//     this.ticketsStatus = ticketsStatus;
//   }
// }



