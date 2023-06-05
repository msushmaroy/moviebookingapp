import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';
import { Movie } from './movieapp/models/Movie';
import { User } from './movieapp/models/User';
import { LoginRequest } from './movieapp/models/LoginRequest';
import { JwtResponse } from './movieapp/models/JwtResponse';
import { Ticket } from './movieapp/models/Ticket';
import { Message } from './movieapp/models/Message';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Component } from '@angular/core';

describe('MovieService', () => {
  let service: MovieService;
  let httpClientSpy : jasmine.SpyObj<HttpClient>;

  let movieList : Movie[] = [
    {movieName: 'Dasara', theatreName: 'Miraj', noOfTicketsAvailable: 126, ticketsStatus: 'BOOK ASAP'},
    {movieName: 'Bhoola', theatreName: 'Miraj', noOfTicketsAvailable: 122, ticketsStatus: 'BOOK ASAP'}
  ]

  let movie : Movie[] = [
    {movieName: 'Dasara', theatreName: 'Miraj', noOfTicketsAvailable: 126, ticketsStatus: 'BOOK ASAP'}
  ]

  let testUser : User = {
    loginId:'user',
    firstName : 'user',
    lastName : 'user',
    email : 'user@gmail.com',
    contactNumber : 9876543210,
    password : 'password',
    roles : ['user']
  }

  let testToken = "testtoken"

  let response : JwtResponse = {
    accessToken : testToken,
    type : 'token',
    roles : ['user'],
    email : 'user@gmail.com',
    username : 'user',
    _id : {
      timestamp : 123,
      date : 'today'
    }
  }

  let request : LoginRequest = {
    loginId : 'user',
    password : 'password'
  }

  let message : Message = {
    message : "Action Done"
  }

  let ticket : Ticket = {
    loginId: 'user',
    movieName : 'Dasara',
    theatreName : 'miraj',
    noOfTickets : 2,
    seatNumber : ['a1','a2']
  }

  let movieToSend : Movie = {
    movieName: 'Dasara',
    theatreName: 'Miraj', 
    noOfTicketsAvailable: 126, 
    ticketsStatus: 'BOOK ASAP'
  }

  let ticketsBooked : Ticket[] = [
    {loginId: 'user',
    movieName : 'Dasara',
    theatreName : 'miraj',
    noOfTickets : 2,
    seatNumber : ['a1','a2']}
  ];

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient',['get','post','put','delete']);
    service = new MovieService(httpClientSpy);
    });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should validate', () => {
    expect(service.validateMovieName("movieName")).toEqual("Moviename");
  })

  describe("getAllMovies()",()=>{
    it("should return the movie list", () => {
      httpClientSpy.get.and.returnValue(of(movieList));
      service.getAllMovies().subscribe({
        next: (allMovies) => {
          expect(movieList).toEqual(movieList);
        }
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    })
  })

  describe("getMovieByName()",()=>{
    it("should return the movie", () => {
      httpClientSpy.get.and.returnValue(of(movie));
      service.getMovieByName('Dasara').subscribe({
        next: (movieFound) => {
          expect(movieFound).toEqual(movie)
        }
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
  })

  describe("registerAUser()",()=>{
    it("should sholud register", () => {
      httpClientSpy.post.and.returnValue(of("User registered"));
      service.registerAUser(testUser).subscribe({
        next: (response) =>{
          expect(response).toBe('User registered')
        }
      })
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
    })
  })

  describe("login()",()=>{
    it("should login", () => {
      httpClientSpy.post.and.returnValue(of(response));
      service.login(request).subscribe({
        next: (res) =>{
          expect(res).toBe(response);
        }
      })
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
    })
  })

  describe("bookTickets()",()=>{
    it("should book", () => {
      httpClientSpy.post.and.returnValue(of(message));
      service.bookTickets(ticket).subscribe({
        next: (res) =>{
          expect(res).toBe(message);
        }
      })
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
    })
  })

  describe("forgetPassword()",()=>{
    it("should reset password", () => {
      httpClientSpy.put.and.returnValue(of(message));
      service.forgetPassword(request).subscribe({
        next: (res) =>{
          expect(res).toBe(message);
        }
      })
      expect(httpClientSpy.put).toHaveBeenCalledTimes(1)
    })
  })

  describe("forUpdatingAMovie()",()=>{
    it("should udpate movie", () => {
      httpClientSpy.put.and.returnValue(of(message));
      service.forUpdatingAMovie(movieToSend).subscribe({
        next: (res) =>{
          expect(res).toBe(message);
        }
      })
      expect(httpClientSpy.put).toHaveBeenCalledTimes(1)
    })
  })

  describe("forDeletingAMovie()",()=>{
    it("should delete movie", () => {
      httpClientSpy.delete.and.returnValue(of(message));
      service.forDeletingAMovie("dasara").subscribe({
        next: (res) =>{
          expect(res).toBe(message);
        }
      })
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1)
    })
  })

  describe("forGettingAllBookedTickets()",()=>{
    it("should get all bookings", () => {
      httpClientSpy.get.and.returnValue(of(ticketsBooked));
      service.forGettingAllBookedTickets("dasara").subscribe({
        next: (res) =>{
          expect(res).toBe(ticketsBooked);
        }
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
  })

  describe("isAuthenticated()",()=>{
    it("should check not authenticated", () => {
      sessionStorage.clear()
      expect(service.isAuthenticated()).toBeFalsy();
    })
  })

  describe("isAuthenticated()",()=>{
    it("should check authenticated", () => {
      sessionStorage.setItem("token", "token");
      expect(service.isAuthenticated()).toBeTruthy();
    })
  })

  describe("isAuthenticated()",()=>{
    it("should check authenticated", () => {
      sessionStorage.setItem("loginStatus", "user");
      expect(service.isAuthenticated()).toBeTruthy();
    })
  })

  it("should set movi name", ()=>{
    
  })

  
});
