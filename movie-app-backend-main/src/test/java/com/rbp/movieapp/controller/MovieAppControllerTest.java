package com.rbp.movieapp.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rbp.movieapp.kafka.KafkaProducerConfig;
import com.rbp.movieapp.models.Movie;
import com.rbp.movieapp.models.Ticket;
import com.rbp.movieapp.models.User;
import com.rbp.movieapp.payload.request.LoginRequest;
import com.rbp.movieapp.repository.MovieRepository;
import com.rbp.movieapp.repository.UserRepository;
import com.rbp.movieapp.security.services.MovieService;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.*;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
public class MovieAppControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MovieService movieService;

    @MockBean
    private KafkaTemplate kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private MovieRepository movieRepository;


    @Test
    void getAllMoviesAndNoneFound() throws Exception {
        authenticateUser();
        // Use MockMvc to send a GET request to the /api/v1.0/moviebooking/all endpoint
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1.0/moviebooking/all"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAllMoviesAndFound() throws Exception {
        authenticateUser();
        List<Movie> movies = new ArrayList<>();
        Movie movie1 = new Movie("Movie 1", "Theatre 1", 120, "Book now");
        Movie movie2 = new Movie("Movie 2", "Theatre 2", 150, "Book now");
        movies.add(movie1);
        movies.add(movie2);

        when(movieService.getAllMovies()).thenReturn(movies);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1.0/moviebooking/all"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetMovieByNameAndFound() throws Exception {
        authenticateUser();
        String movieName = "Movie";
        List<Movie> movieList = new ArrayList<>();
        movieList.add(new Movie("Movie", "Theatre 1", 120, "Book now"));
        when(movieService.getMovieByName(movieName)).thenReturn(movieList);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1.0/moviebooking/movies/search/{movieName}", movieName))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

    }

    @Test
    public void testGetMovieByNameAndNotFound() throws Exception {
        authenticateUser();
        String movieName = "Movie";
        List<Movie> movieList = new ArrayList<>();
        when(movieService.getMovieByName(movieName)).thenReturn(movieList);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1.0/moviebooking/movies/search/{movieName}", movieName))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetAllBookedTickets() throws Exception {
        // Mock the ticket list that will be returned by the service method
        authenticateAdmin();
        List<Ticket> ticketList = new ArrayList<>();
        ticketList.add(new Ticket("chandan","The Matrix", "Screen 1", 2, new ArrayList<String>(List.of("a1","a2"))));
        when(movieService.getAllBookedTickets("Movie1")).thenReturn(ticketList);

        // Perform GET request to endpoint
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1.0/moviebooking/getallbookedtickets/Movie1"))
                .andExpect(status().isOk());

    }

    @Test
    public void testDeleteMovie_withUserRole_shouldReturnForbidden() throws Exception {
        authenticateUser();
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/v1.0/moviebooking/SomeMovieName/delete"))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testDeleteMovie_withoutToken_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/v1.0/moviebooking/SomeMovieName/delete")
                        .with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testDeleteMovie_withAdminRole_shouldDeleteMovie() throws Exception {
        authenticateAdmin();
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/v1.0/moviebooking/Dasara/delete"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testUpdateTicketsStatus_withAdminRole_shouldAddTicketsStatus() throws Exception {
        authenticateAdmin();

        Movie movie = new Movie("The Avengers", "Theatre 1", 100, "Book now");
        movieRepository.save(movie);
//        System.out.println(movieRepository.findAll());


        Movie updatedMovie = new Movie("The Avengers", "Theatre 1", 50, "Sold out");

        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1.0/moviebooking/{movieName}/update/{ticketsStatus}", "The Avengers", "Sold out")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedMovie)))
                .andExpect(status().isOk());
    }



//    @Test
//    public void testUpdateTicketsStatus_withAdminRole_shouldUpdateTicketsStatus() throws Exception {
//        authenticateAdmin();
//
//        Movie updatedMovie = new Movie("Dasara", "Miraj", 50, "Sold out");
//
//        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1.0/moviebooking/{movieName}/update/{ticketsStatus}", "Dasara", "Sold out")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(updatedMovie)))
//                .andExpect(status().isOk())
//                .andExpect(content().string("Movie Updated successfully"));
//    }


    private void authenticateUser(){
        // Mock the authentication process
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        "testUser", "testPassword", List.of(new SimpleGrantedAuthority("ROLE_USER"))
                )
        );
    }

    private void authenticateAdmin(){
        // Mock the authentication process
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        "testUser", "testPassword", List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
                )
        );
    }
}
