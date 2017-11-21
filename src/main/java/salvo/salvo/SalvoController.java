package salvo.salvo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.*;

@RestController
@RequestMapping("/api")
public class SalvoController {

    @Autowired
    private GameRepository gameRepo;
    @Autowired
    private PlayerRepository playerRepo;
    @Autowired
    private GamePlayerRepository gamePlayerRepo;

    @RequestMapping("/games")
        public List<Object> getGames() {
        List<Object> gameList = new ArrayList<>();
        for (Game game : gameRepo.findAll()) {
            Map<String,Object> idDateMap = new HashMap<>();
            Date gamesDate = game.getDate();
            Long idG = game.getId();
            idDateMap.put("id", idG);
            idDateMap.put("created", gamesDate);
            List<Object> gamePlayerList = new ArrayList<>();
            for (GamePlayer gpr : gamePlayerRepo.findAll()) {
                Map<String, Object> gamePlayerMap = new HashMap<> ();
                List<Object> playerList = new ArrayList<>();
                for (Player player: playerRepo.findAll()) {
                    Map<String, Object> playerMap = new HashMap<> ();
                    Long idP = player.getId();
                    String email = player.getUserName();
                    playerMap.put("id", idP);
                    playerMap.put("player", email);
                    playerList.add(playerMap);
                }
                gamePlayerMap.put("gamePlayers", playerList);
                gamePlayerList.add(gamePlayerMap);
            }
            idDateMap.put("gamePlayers", gamePlayerList);
            gameList.add(idDateMap);
        }
        return gameList;
    }

    @RequestMapping("/players")
    public List<Player> getPlayers () {
        return  playerRepo.findAll();
    }
    @RequestMapping("/gamePlayers")
    public List<GamePlayer> getGamePlayers () {
        return gamePlayerRepo.findAll();
    }
}
