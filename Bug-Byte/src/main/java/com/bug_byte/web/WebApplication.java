package com.bug_byte.web;

import com.bug_byte.web.controllers.AddQuestions;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class WebApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebApplication.class, args);
	}

	@Bean
	public CommandLineRunner run(AddQuestions addQuestions) {
		return args -> {
			addQuestions.populationQuestionDB();
		};
	}
}
