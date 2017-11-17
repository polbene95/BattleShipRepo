package salvo.salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {

		SpringApplication.run(SalvoApplication.class, args);
	}
	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository,GameRepository gameRepository) {
		return (args) -> {
			playerRepository.save(new Player("Player 1"));
			playerRepository.save(new Player("Player 2"));
			gameRepository.save(new Game());
			gameRepository.save(new Game());
			gameRepository.save(new Game());
		};
	}

	}

