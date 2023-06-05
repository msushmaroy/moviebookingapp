package com.rbp.movieapp;

import com.rbp.movieapp.models.ERole;
import com.rbp.movieapp.models.Movie;
import com.rbp.movieapp.models.Role;
import com.rbp.movieapp.models.User;
import com.rbp.movieapp.repository.MovieRepository;
import com.rbp.movieapp.repository.RoleRepository;
import com.rbp.movieapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@SpringBootApplication
public class MovieappApplication implements CommandLineRunner {

	@Autowired
	private MovieRepository movieRepository;
	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private MongoTemplate mongoTemplate;
	@Autowired
	private UserRepository userRepository;

	@Autowired
	PasswordEncoder encoder;

	@Value(value = "${admin.password}")
	private String password;


	public static void main(String[] args) {
		SpringApplication.run(MovieappApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

		mongoTemplate.dropCollection("roles");
		mongoTemplate.dropCollection("ticket");
		mongoTemplate.dropCollection("users");
		mongoTemplate.dropCollection("movie");

		Movie movie1 = new Movie("Dasara","Miraj",126,"BOOK ASAP");
	 	Movie movie2 = new Movie("Bhoola","Miraj",122,"BOOK ASAP");
	 	Movie movie3 = new Movie("Balagam","Konark",107,"BOOK ASAP");

	 	movieRepository.saveAll(List.of(movie1,movie2,movie3));

		Role admin = new Role(ERole.ROLE_ADMIN);
		Role user = new Role(ERole.ROLE_USER);

		roleRepository.saveAll(List.of(admin,user));

		User adminUser = new User("srm",
				"sushma",
				"roy",
				"sushmaroy1@gmail.com",
				9876543210L,
				encoder.encode(password)
		);
		Set<Role> roles = new HashSet<>();
		Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN).get();
		roles.add(adminRole);
		adminUser.setRoles(roles);
		userRepository.save(adminUser);
	}
}
