export interface JwtResponse{
    accessToken:string;
    type : string;
    _id: {
        timestamp: number,
        date: string ,
    };
    username : string;
    email : string;
    roles : string[];

}