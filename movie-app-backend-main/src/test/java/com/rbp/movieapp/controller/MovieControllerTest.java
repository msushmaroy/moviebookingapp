package com.rbp.movieapp.controller;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rbp.movieapp.models.Movie;
import com.rbp.movieapp.models.Ticket;
import com.rbp.movieapp.models.User;
import com.rbp.movieapp.payload.request.LoginRequest;
import com.rbp.movieapp.repository.UserRepository;
import com.rbp.movieapp.security.services.MovieService;
import com.rbp.movieapp.security.services.UserDetailsServiceImpl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Optional;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.TopicPartition;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ContextConfiguration(classes = {MovieController.class})
@ExtendWith(SpringExtension.class)
class MovieControllerTest {
    @MockBean
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    private MovieController movieController;

    @MockBean
    private MovieService movieService;

    @MockBean
    private NewTopic newTopic;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @MockBean
    private UserRepository userRepository;

    /**
     * Method under test: {@link MovieController#bookTickets(Ticket, String)}
     */
    @Test
    void testBookTickets() throws Exception {
        ProducerRecord<String, Object> producerRecord = new ProducerRecord<>("Topic", "Value");

        when(kafkaTemplate.send(Mockito.<String>any(), Mockito.<Object>any())).thenReturn(new AsyncResult<>(
                new SendResult<>(producerRecord, new RecordMetadata(new TopicPartition("Topic", 1), 1L, 1, 10L, 3, 3))));

        Movie movie = new Movie();
        movie.setMovieName("?");
        movie.setNoOfTicketsAvailable(2);
        movie.setTheatreName("?");
        movie.setTicketsStatus("?");
        movie.set_id(ObjectId.get());

        ArrayList<Movie> movieList = new ArrayList<>();
        movieList.add(movie);
        doNothing().when(movieService).saveTicket(Mockito.<Ticket>any());
        when(movieService.findAvailableTickets(Mockito.<String>any(), Mockito.<String>any())).thenReturn(movieList);
        when(movieService.findSeats(Mockito.<String>any(), Mockito.<String>any())).thenReturn(new ArrayList<>());
        when(newTopic.name()).thenReturn("Name");

        Ticket ticket = new Ticket();
        ticket.setLoginId("42");
        ticket.setMovieName("Movie Name");
        ticket.setNoOfTickets(1);
        ticket.setSeatNumber(new ArrayList<>());
        ticket.setTheatreName("Theatre Name");
        ticket.set_id(ObjectId.get());
        String content = (new ObjectMapper()).writeValueAsString(ticket);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .post("/api/v1.0/moviebooking/{movieName}/add", "Movie Name")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(movieController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string("{\"seatNumbers\":\"[]\",\"message\":\"Tickets Booked Successfully\"}"));
    }

    /**
     * Method under test: {@link MovieController#bookTickets(Ticket, String)}
     */
    @Test
    void testBookTickets2() throws Exception {
        ProducerRecord<String, Object> producerRecord = new ProducerRecord<>("Topic", "Value");

        when(kafkaTemplate.send(Mockito.<String>any(), Mockito.<Object>any())).thenReturn(new AsyncResult<>(
                new SendResult<>(producerRecord, new RecordMetadata(new TopicPartition("Topic", 1), 1L, 1, 10L, 3, 3))));

        Movie movie = new Movie();
        movie.setMovieName("?");
        movie.setNoOfTicketsAvailable(0);
        movie.setTheatreName("?");
        movie.setTicketsStatus("?");
        movie.set_id(ObjectId.get());

        ArrayList<Movie> movieList = new ArrayList<>();
        movieList.add(movie);
        doNothing().when(movieService).saveTicket(Mockito.<Ticket>any());
        when(movieService.findAvailableTickets(Mockito.<String>any(), Mockito.<String>any())).thenReturn(movieList);
        when(movieService.findSeats(Mockito.<String>any(), Mockito.<String>any())).thenReturn(new ArrayList<>());
        when(newTopic.name()).thenReturn("Name");

        Ticket ticket = new Ticket();
        ticket.setLoginId("42");
        ticket.setMovieName("Movie Name");
        ticket.setNoOfTickets(1);
        ticket.setSeatNumber(new ArrayList<>());
        ticket.setTheatreName("Theatre Name");
        ticket.set_id(ObjectId.get());
        String content = (new ObjectMapper()).writeValueAsString(ticket);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .post("/api/v1.0/moviebooking/{movieName}/add", "Movie Name")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(movieController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content().string("{\"message\":\"\\\"All tickets sold out\\\"\"}"));
    }

    /**
     * Method under test: {@link MovieController#changePassword(LoginRequest, String)}
     */
    @Test
    void testChangePassword() throws Exception {
        User user = new User();
        user.setContactNumber(1L);
        user.setEmail("jane.doe@example.org");
        user.setFirstName("Jane");
        user.setLastName("Doe");
        user.setLoginId("42");
        user.setPassword("iloveyou");
        user.setRoles(new HashSet<>());
        user.set_id(ObjectId.get());
        Optional<User> ofResult = Optional.of(user);

        User user2 = new User();
        user2.setContactNumber(1L);
        user2.setEmail("jane.doe@example.org");
        user2.setFirstName("Jane");
        user2.setLastName("Doe");
        user2.setLoginId("42");
        user2.setPassword("iloveyou");
        user2.setRoles(new HashSet<>());
        user2.set_id(ObjectId.get());
        when(userRepository.save(Mockito.<User>any())).thenReturn(user2);
        when(userRepository.findByLoginId(Mockito.<String>any())).thenReturn(ofResult);
        when(passwordEncoder.encode(Mockito.<CharSequence>any())).thenReturn("secret");

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setLoginId("42");
        loginRequest.setPassword("iloveyou");
        String content = (new ObjectMapper()).writeValueAsString(loginRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .put("/api/v1.0/moviebooking/{loginId}/forgot", "42")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(movieController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content().string("{\"message\":\"Users password changed successfully\"}"));
    }

    /**
     * Method under test: {@link MovieController#deleteMovie(String)}
     */
    @Test
    void testDeleteMovie() throws Exception {
        ProducerRecord<String, Object> producerRecord = new ProducerRecord<>("Topic", "Value");

        when(kafkaTemplate.send(Mockito.<String>any(), Mockito.<Object>any())).thenReturn(new AsyncResult<>(
                new SendResult<>(producerRecord, new RecordMetadata(new TopicPartition("Topic", 1), 1L, 1, 10L, 3, 3))));

        Movie movie = new Movie();
        movie.setMovieName("?");
        movie.setNoOfTicketsAvailable(1);
        movie.setTheatreName("?");
        movie.setTicketsStatus("?");
        movie.set_id(ObjectId.get());

        ArrayList<Movie> movieList = new ArrayList<>();
        movieList.add(movie);
        doNothing().when(movieService).deleteByMovieName(Mockito.<String>any());
        when(movieService.findByMovieName(Mockito.<String>any())).thenReturn(movieList);
        when(newTopic.name()).thenReturn("Name");
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .delete("/api/v1.0/moviebooking/{movieName}/delete", "Movie Name");
        MockMvcBuilders.standaloneSetup(movieController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content().string("{\"message\":\"Movie deleted successfully\"}"));
    }

    /**
     * Method under test: {@link MovieController#deleteMovie(String)}
     */
    @Test
    void testDeleteMovie2() throws Exception {
        ProducerRecord<String, Object> producerRecord = new ProducerRecord<>("Topic", "Value");

        when(kafkaTemplate.send(Mockito.<String>any(), Mockito.<Object>any())).thenReturn(new AsyncResult<>(
                new SendResult<>(producerRecord, new RecordMetadata(new TopicPartition("Topic", 1), 1L, 1, 10L, 3, 3))));

        Movie movie = new Movie();
        movie.setMovieName("?");
        movie.setNoOfTicketsAvailable(1);
        movie.setTheatreName("?");
        movie.setTicketsStatus("?");
        movie.set_id(ObjectId.get());

        ArrayList<Movie> movieList = new ArrayList<>();
        movieList.add(movie);
        doNothing().when(movieService).deleteByMovieName(Mockito.<String>any());
        when(movieService.findByMovieName(Mockito.<String>any())).thenReturn(movieList);
        when(newTopic.name()).thenReturn("Name");
        SecurityMockMvcRequestBuilders.FormLoginRequestBuilder requestBuilder = SecurityMockMvcRequestBuilders
                .formLogin();
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(movieController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    /**
     * Method under test: {@link MovieController#updateTicketsStatus(Movie, String, String)}
     */
    @Test
    void testUpdateTicketsStatus() throws Exception {
        ProducerRecord<String, Object> producerRecord = new ProducerRecord<>("Topic", "Value");

        when(kafkaTemplate.send(Mockito.<String>any(), Mockito.<Object>any())).thenReturn(new AsyncResult<>(
                new SendResult<>(producerRecord, new RecordMetadata(new TopicPartition("Topic", 1), 1L, 1, 10L, 3, 3))));
        when(movieService.findAvailableTickets(Mockito.<String>any(), Mockito.<String>any())).thenReturn(new ArrayList<>());
        doNothing().when(movieService).saveMovie(Mockito.<Movie>any());
        when(newTopic.name()).thenReturn("Name");

        Movie movie = new Movie();
        movie.setMovieName("Movie Name");
        movie.setNoOfTicketsAvailable(1);
        movie.setTheatreName("Theatre Name");
        movie.setTicketsStatus("Tickets Status");
        movie.set_id(ObjectId.get());
        String content = (new ObjectMapper()).writeValueAsString(movie);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .put("/api/v1.0/moviebooking/{movieName}/update/{ticketsStatus}", "Movie Name", "Tickets Status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(movieController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content().string("{\"message\":\"Movie added successfully\"}"));
    }

    /**
     * Method under test: {@link MovieController#updateTicketsStatus(Movie, String, String)}
     */
    @Test
    void testUpdateTicketsStatus2() throws Exception {
        ProducerRecord<String, Object> producerRecord = new ProducerRecord<>("Topic", "Value");

        when(kafkaTemplate.send(Mockito.<String>any(), Mockito.<Object>any())).thenReturn(new AsyncResult<>(
                new SendResult<>(producerRecord, new RecordMetadata(new TopicPartition("Topic", 1), 1L, 1, 10L, 3, 3))));

        Movie movie = new Movie();
        movie.setMovieName("?");
        movie.setNoOfTicketsAvailable(2);
        movie.setTheatreName("?");
        movie.setTicketsStatus("?");
        movie.set_id(ObjectId.get());

        ArrayList<Movie> movieList = new ArrayList<>();
        movieList.add(movie);
        when(movieService.findAvailableTickets(Mockito.<String>any(), Mockito.<String>any())).thenReturn(movieList);
        doNothing().when(movieService).saveMovie(Mockito.<Movie>any());
        when(newTopic.name()).thenReturn("Name");

        Movie movie2 = new Movie();
        movie2.setMovieName("Movie Name");
        movie2.setNoOfTicketsAvailable(1);
        movie2.setTheatreName("Theatre Name");
        movie2.setTicketsStatus("Tickets Status");
        movie2.set_id(ObjectId.get());
        String content = (new ObjectMapper()).writeValueAsString(movie2);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .put("/api/v1.0/moviebooking/{movieName}/update/{ticketsStatus}", "Movie Name", "Tickets Status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(movieController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content().string("{\"message\":\"Movie Updated successfully\"}"));
    }
}

