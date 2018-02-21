package salvo.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {

		SpringApplication.run(SalvoApplication.class, args);
	}
	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository,GameRepository gameRepository, GamePlayerRepository gamePlayerRepository, ShipRepository shipRepository, SalvoRepository salvoRepository, ScoreRepository scoreRepository) {
		return (args) -> {
			Player p1 = playerRepository.save(new Player("j.bauer", "777"));
			Player p2 = playerRepository.save(new Player("c.obrian", "777"));
			Player p3 = playerRepository.save(new Player("t.almeida", "777"));
			Player p4 = playerRepository.save(new Player("d.palmer", "777"));

			List<Player> ppp = playerRepository.findByUserName("j.bauer@ctu.gov");
			System.out.println(ppp);

			Game g1 = gameRepository.save(new Game());
			Game g2 = gameRepository.save(new Game());
			Game g3 = gameRepository.save(new Game());
			Game g4 = gameRepository.save(new Game());

			GamePlayer gp1 = gamePlayerRepository.save(new GamePlayer(p1, g1));
			GamePlayer gp2 = gamePlayerRepository.save(new GamePlayer(p2, g1));
			GamePlayer gp3 = gamePlayerRepository.save(new GamePlayer(p1, g2));
			GamePlayer gp4 = gamePlayerRepository.save(new GamePlayer(p2, g2));
			GamePlayer gp5 = gamePlayerRepository.save(new GamePlayer(p1, g3));
			GamePlayer gp6 = gamePlayerRepository.save(new GamePlayer(p3, g3));
			GamePlayer gp7 = gamePlayerRepository.save(new GamePlayer(p4, g4));

			List<String> loc1 = Arrays.asList("H2", "H3");
			List<String> loc2 = Arrays.asList("B3", "C3", "D3");
			List<String> loc3 = Arrays.asList("G5");
			List<String> loc4 = Arrays.asList("H1", "H2");
			List<String> loc5 = Arrays.asList("H4", "H5");
			List<String> loc6 = Arrays.asList("H6", "H7");
			List<String> loc7 = Arrays.asList("H8", "H9");
			List<String> loc8 = Arrays.asList("A1");

			List<String> salvoLoc1 = Arrays.asList("H1","H2","H4","H5");
			List<String> salvoLoc2 = Arrays.asList("A8","A7","A6");
			List<String> salvoLoc3 = Arrays.asList("A1","H6","H7","H8");
			List<String> salvoLoc4 = Arrays.asList("B3","C3","D3");

			Salvo salvo1 = salvoRepository.save(new Salvo(salvoLoc1, gp1, 1));
			Salvo salvo2 = salvoRepository.save(new Salvo(salvoLoc2, gp2, 1));
			Salvo salvo3 = salvoRepository.save(new Salvo(salvoLoc3, gp1, 2));
			Salvo salvo4 = salvoRepository.save(new Salvo(salvoLoc4, gp2, 2));

			Ship s1 = shipRepository.save(new Ship("cruiser", loc1, gp1));
			Ship s2 = shipRepository.save(new Ship("destructor",loc2, gp1));
			Ship s3 = shipRepository.save(new Ship("boat",loc3,gp1));
			Ship s7 = shipRepository.save(new Ship("boat",loc7,gp1));
			Ship s4 = shipRepository.save(new Ship("cruiser", loc4, gp2));
			Ship s5 = shipRepository.save(new Ship("destructor",loc5, gp2));
			Ship s6 = shipRepository.save(new Ship("boat",loc6,gp2));
			Ship s8 = shipRepository.save(new Ship("boat",loc8,gp2));

//			Score scoreGP1 = scoreRepository.save(new Score(1,p1, g1));
//			Score scoreGP2 = scoreRepository.save(new Score(0,p2, g1));
//			Score scoreGP3 = scoreRepository.save(new Score(1,p1, g2));
//			Score scoreGP4 = scoreRepository.save(new Score(0,p2, g2));
//			Score scoreGP5 = scoreRepository.save(new Score(0.5,p1, g3));
//			Score scoreGP6 = scoreRepository.save(new Score(0.5,p3, g3));

		};
	}
}

@Configuration
class WebSecurityConfiguration extends GlobalAuthenticationConfigurerAdapter {

	@Autowired
	PlayerRepository playerRepository;

	@Override
	public void init(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService());
	}

	@Bean
	UserDetailsService userDetailsService() {
		return new UserDetailsService() {

			@Override
			public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
				List<Player> people = playerRepository.findByUserName(name);
				if (!people.isEmpty()) {
					Player person = people.get(0);
					return new User(person.getUserName(), person.getPassword(),
							AuthorityUtils.createAuthorityList("USER"));
				} else {
					throw new UsernameNotFoundException("Unknown user: " + name);
				}
			}
		};
	}
}
@EnableWebSecurity
@Configuration
class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests()
				.antMatchers("/").permitAll()
				.antMatchers("/api/leaderboard").permitAll()
				.antMatchers("/api/games").permitAll()
				.antMatchers("/api/players").permitAll()
				.antMatchers("/api/createGame").permitAll()
				.antMatchers("/web/games.html").permitAll()
				.antMatchers("/web/style/game.css").permitAll()
				.antMatchers("/web/style/games.css").permitAll()
				.antMatchers("/web/style/imatges/**").permitAll()
				.antMatchers("/web/script/game.js").permitAll()
				.antMatchers("/web/script/games.js").permitAll()
				.antMatchers("/rest").denyAll()
				.anyRequest().fullyAuthenticated();

		http.formLogin()
				.usernameParameter("username")
				.passwordParameter("password")
				.loginPage("/api/login");

		http.logout().logoutUrl("/api/logout");

		// turn off checking for CSRF tokens
		http.csrf().disable();
		// if user is not authenticated, just send an authentication failure response
		http.exceptionHandling().authenticationEntryPoint((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));
		// if login is successful, just clear the flags asking for authentication
		http.formLogin().successHandler((req, res, auth) -> clearAuthenticationAttributes(req));
		// if login fails, just send an authentication failure response
		http.formLogin().failureHandler((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));
		// if logout is successful, just send a success response
		http.logout().logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler());
	}
	private void clearAuthenticationAttributes(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session != null) {
			session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
		}
	}
}


