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
	public CommandLineRunner initData(PlayerRepository playerRepository,GameRepository gameRepository, GamePlayerRepository gamePlayerRepository, ShipRepository shipRepository, SalvoRepository salvoRepository) {
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
			List<String> loc2 = Arrays.asList("B3", "C3", "D3");
			List<String> loc3 = Arrays.asList("G5");
			List<String> loc4 = Arrays.asList("H1", "H2");
			List<String> loc5 = Arrays.asList("H4", "H5");
			List<String> loc6 = Arrays.asList("H6", "H7");

			List<String> salvoLoc1 = Arrays.asList("H1","B5","G7");
			List<String> salvoLoc2 = Arrays.asList("A8","A7","A6");
			List<String> salvoLoc3 = Arrays.asList("D4","I1","E8");
			List<String> salvoLoc4 = Arrays.asList("B3","C3","D3");

			Salvo salvo1 = salvoRepository.save(new Salvo(salvoLoc1, gp1, 1));
			Salvo salvo2 = salvoRepository.save(new Salvo(salvoLoc2, gp2, 1));
			Salvo salvo3 = salvoRepository.save(new Salvo(salvoLoc3, gp1, 2));
			Salvo salvo4 = salvoRepository.save(new Salvo(salvoLoc4, gp2, 2));

			Ship s1 = shipRepository.save(new Ship("cruiser", loc1, gp1));
			Ship s2 = shipRepository.save(new Ship("destructor",loc2, gp1));
			Ship s3 = shipRepository.save(new Ship("boat",loc3,gp1));
			Ship s4 = shipRepository.save(new Ship("cruiser", loc4, gp2));
//			Ship s5 = shipRepository.save(new Ship("destructor",loc5, gp2));
//			Ship s6 = shipRepository.save(new Ship("boat",loc6,gp2));
		};
	}
}

