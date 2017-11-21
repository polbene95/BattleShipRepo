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
	public CommandLineRunner initData(PlayerRepository playerRepository,GameRepository gameRepository, GamePlayerRepository gamePlayerRepository) {
		return (args) -> {
			Player p1 = playerRepository.save(new Player("j.bauer@ctu.gov"));
			Player p2 = playerRepository.save(new Player("c.obrian@ctu.gov"));
			Player p3 = playerRepository.save(new Player("t.almeida@ctu.gov"));
			Player p4 = playerRepository.save(new Player("d.palmer@whitehouse.gov"));

			Game g1 = gameRepository.save(new Game());
			gamePlayerRepository.save(new GamePlayer(p1, g1));

		};
	}
}

