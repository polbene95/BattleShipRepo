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
			Game g2 = gameRepository.save(new Game());
			Game g3 = gameRepository.save(new Game());
			Game g4 = gameRepository.save(new Game());

			GamePlayer gp1 = gamePlayerRepository.save(new GamePlayer(p1, g1));
			GamePlayer gp2 = gamePlayerRepository.save(new GamePlayer(p2, g1));
			GamePlayer gp3 = gamePlayerRepository.save(new GamePlayer(p2, g2));
			GamePlayer gp4 = gamePlayerRepository.save(new GamePlayer(p3, g2));
			GamePlayer gp5 = gamePlayerRepository.save(new GamePlayer(p1, g3));
			GamePlayer gp6 = gamePlayerRepository.save(new GamePlayer(p4, g3));
			GamePlayer gp7 = gamePlayerRepository.save(new GamePlayer(p3, g4));
			GamePlayer gp8 = gamePlayerRepository.save(new GamePlayer(p4, g4));
		};
	}
}

