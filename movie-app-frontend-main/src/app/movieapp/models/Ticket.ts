export interface Ticket{
    _id?: {
        timestamp: number,
        date: string
      },
    loginId : string;
    movieName : string;
    theatreName : string;
    noOfTickets : number;
    seatNumber : string[];
}