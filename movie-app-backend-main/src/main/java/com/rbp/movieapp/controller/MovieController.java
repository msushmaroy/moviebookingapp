package com.rbp.movieapp.controller;

import com.rbp.movieapp.exception.MoviesNotFound;
import com.rbp.movieapp.exception.SeatAlreadyBooked;
import com.rbp.movieapp.models.Movie;
import com.rbp.movieapp.models.Ticket;
import com.rbp.movieapp.models.User;
import com.rbp.movieapp.payload.request.LoginRequest;
import com.rbp.movieapp.repository.MovieRepository;
import com.rbp.movieapp.repository.TicketRepository;
import com.rbp.movieapp.repository.UserRepository;
import com.rbp.movieapp.security.services.MovieService;
import com.rbp.movieapp.security.services.UserDetailsImpl;
import com.rbp.movieapp.security.services.UserDetailsServiceImpl;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.admin.NewTopic;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1.0/moviebooking")
@OpenAPIDefinition(
        info = @Info(
                title = "Movie Application API",
                description = "This API provides endpoints for managing movies."
        )
)
@Slf4j
public class MovieController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    private MovieService movieService;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

//    @Autowired
//    private KafkaTemplate<String, Object> kafkaTemplate;
//
//    @Autowired
//    private NewTopic topic;


    @PutMapping("/{loginId}/forgot")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "reset password")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody LoginRequest loginRequest, @PathVariable String loginId){
        log.debug("forgot password endopoint accessed by "+loginRequest.getLoginId());
        Optional<User> user1 = userRepository.findByLoginId(loginId);
            User availableUser = user1.get();
            User updatedUser = new User(
                            loginId,
                    availableUser.getFirstName(),
                    availableUser.getLastName(),
                    availableUser.getEmail(),
                    availableUser.getContactNumber(),
                    passwordEncoder.encode(loginRequest.getPassword())
                    );
            updatedUser.set_id(availableUser.get_id());
            updatedUser.setRoles(availableUser.getRoles());
            userRepository.save(updatedUser);
            log.debug(loginRequest.getLoginId()+" has password changed successfully");
            Map<String, String> response = new HashMap<>();
            response.put("message", "Users password changed successfully");
            return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @GetMapping("/all")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "search all movies")
//    @PreAuthorize("hasRole('USER')or hasRole('ADMIN')")
    public ResponseEntity<List<Movie>> getAllMovies(){
        log.debug("here u can access all the available movies");
        List<Movie> movieList = movieService.getAllMovies();
        if(movieList.isEmpty()){
            log.debug("currently no movies are available");
            throw new MoviesNotFound("No Movies are available");
        }
        else{
            log.debug("listed the available movies");
            return new ResponseEntity<>(movieList, HttpStatus.OK);
        }
    }

    @GetMapping("/movies/search/{movieName}")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "search movies by movie name")
//    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Movie>> getMovieByName(@PathVariable String movieName){
        log.debug("here search a movie by its name");
        List<Movie> movieList = movieService.getMovieByName(movieName);
        if(movieList.isEmpty()){
            log.debug("currently no movies are available");
            throw new MoviesNotFound("Movies Not Found");
        }
        else
            log.debug("listed the available movies with title:"+movieName);
            return new ResponseEntity<>(movieList,HttpStatus.OK);
    }

    @PostMapping("/{movieName}/add")@SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "book ticket")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, String>> bookTickets(@RequestBody Ticket ticket, @PathVariable String movieName) {
        log.debug(ticket.getLoginId()+" entered to book tickets");
        List<Ticket> allTickets = movieService.findSeats(movieName,ticket.getTheatreName());
        for(Ticket each : allTickets){
            for(int i = 0; i < ticket.getNoOfTickets(); i++){
                if(each.getSeatNumber().contains(ticket.getSeatNumber().get(i))){
                    log.debug("seat is already booked");
                    throw new SeatAlreadyBooked("Seat number "+ticket.getSeatNumber().get(i)+" is already booked");
                }
            }
        }

        if(movieService.findAvailableTickets(movieName,ticket.getTheatreName()).get(0).getNoOfTicketsAvailable() >=
                ticket.getNoOfTickets()){

            log.info("available tickets "
                    +movieService.findAvailableTickets(movieName,ticket.getTheatreName()).get(0).getNoOfTicketsAvailable());
            movieService.saveTicket(ticket);
            log.debug(ticket.getLoginId()+" booked "+ticket.getNoOfTickets()+" tickets");
//            kafkaTemplate.send(topic.name(),"Movie ticket booked. Booking Details are: "+ticket);
          updateAvailableTickectsInMovie(movieName,ticket.getTheatreName(),ticket.getNoOfTickets());
//            return new ResponseEntity<>("Tickets Booked Successfully with seat numbers "+ticket.getSeatNumber().toString(),HttpStatus.OK);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tickets Booked Successfully");
            response.put("seatNumbers", ticket.getSeatNumber().toString());

            return new ResponseEntity<>(response, HttpStatus.OK);

        }
        else{
            log.debug("tickets sold out");
            Map<String, String> response = new HashMap<>();
            response.put("message", "\"All tickets sold out\"");
            return new ResponseEntity<>(response,HttpStatus.OK);
        }
    }

    @GetMapping("/getallbookedtickets/{movieName}")@SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "get all booked tickets(Admin Only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Ticket>> getAllBookedTickets(@PathVariable String movieName){
        return new ResponseEntity<>(movieService.getAllBookedTickets(movieName),HttpStatus.OK);
    }

    @PutMapping("/{movieName}/update/{ticketsStatus}")@SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "updates movie(admin only")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> updateTicketsStatus(@RequestBody Movie movie, @PathVariable String movieName,@PathVariable String ticketsStatus){
        List<Movie> availableMovies = movieService.findAvailableTickets(movieName,movie.getTheatreName());
        if(availableMovies.isEmpty()){
            movieService.saveMovie(movie);
//            kafkaTemplate.send(topic.name(),"New Movie added by the Admin.\nDetails: \n"+movie);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Movie added successfully");
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else{
            ObjectId objectId = availableMovies.get(0).get_id();
            movieService.saveMovie(new Movie(
                    objectId,
                    movieName,
                    movie.getTheatreName(),
                    movie.getNoOfTicketsAvailable(),
                    ticketsStatus
            ));
//            kafkaTemplate.send(topic.name(),"tickets status upadated by the Admin for movie "+movieName);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Movie Updated successfully");
            return new ResponseEntity<>(response,HttpStatus.OK);
        }
    }

    @DeleteMapping("/{movieName}/delete")@SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "delete a movie(Admin Only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteMovie(@PathVariable String movieName){
        List<Movie> availableMovies = movieService.findByMovieName(movieName);
        if(availableMovies.isEmpty()){
            throw new MoviesNotFound("No movies Available with moviename "+ movieName);
        }
        else {
            movieService.deleteByMovieName(movieName);
//            kafkaTemplate.send(topic.name(),"Movie Deleted by the Admin. "+movieName+" is now not available");
            Map<String, String> response = new HashMap<>();
            response.put("message", "Movie deleted successfully");
            return new ResponseEntity<>(response,HttpStatus.OK);
        }

    }


    private void updateAvailableTickectsInMovie(String moviename,String theatreName,Integer noOfTickets) {
        ObjectId objectId = movieService.findAvailableTickets(moviename,theatreName).get(0).get_id();
        Movie movie = new Movie(
                objectId,
                moviename,
                theatreName,
                movieService.findAvailableTickets(moviename,theatreName).get(0).getNoOfTicketsAvailable() - noOfTickets
        );
        movieService.saveMovie(movie);
    }

}
