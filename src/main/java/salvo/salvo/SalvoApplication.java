package salvo.salvo;

import org.hibernate.mapping.Array;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {

		SpringApplication.run(SalvoApplication.class, args);
	}
	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository,GameRepository gameRepository, GamePlayerRepository gamePlayerRepository, ShipRepository shipRepository) {
		return (args) -> {
			Player p1 = playerRepository.save(new Player("j.bauer@ctu.gov"));
			Player p2 = playerRepository.save(new Player("c.obrian@ctu.gov"));
			Player p3 = playerRepository.save(new Player("t.almeida@ctu.gov"));
			Player p4 = playerRepository.save(new Player("d.palmer@whitehouse.gov"));

			Game g1 = gameRepository.save(new Game());
			Game g2 = gameRepository.save(new Game());
			Game g3 = gameRepository.save(new Game());

			GamePlayer gp1 = gamePlayerRepository.save(new GamePlayer(p1, g1));
			GamePlayer gp2 = gamePlayerRepository.save(new GamePlayer(p2, g1));
			GamePlayer gp3 = gamePlayerRepository.save(new GamePlayer(p3, g2));
			GamePlayer gp4 = gamePlayerRepository.save(new GamePlayer(p2, g2));
			GamePlayer gp5 = gamePlayerRepository.save(new GamePlayer(p4, g3));
			GamePlayer gp6 = gamePlayerRepository.save(new GamePlayer(p2, g3));

			List<String> loc1 = Arrays.asList("H2", "H3");
			List<String> loc2 = Arrays.asList("H3", "H4");
			List<String> loc3 = Arrays.asList("H5", "H6");
			Ship s0 = shipRepository.save(new Ship());
			Ship s1 = shipRepository.save(new Ship("cruiser", loc1, gp1));
			Ship s2 = shipRepository.save(new Ship("destructorDePussy 8=======D",loc2, gp1));
			Ship s3 = shipRepository.save(new Ship("boat",loc3,gp1));
//			gp2.addShips(s0);

		};
	}
}

