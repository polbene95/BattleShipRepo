package salvo.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.yaml.snakeyaml.events.Event;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SalvoController {

    @Autowired
    private GameRepository gameRepo;
    
    private PlayerRepository playerRepo;
    private GamePlayerRepository gamePlayerRepo;

    @RequestMapping("/games")
    public List<Long> getGames() {
        List<Long> idList = new ArrayList<>();

        for (Game game : gameRepo.findAll()) {
            idList.add(game.getId());
        }
        return idList;
    }
    @RequestMapping("/players")
    public List<Player> getPlayers () {
        return  playerRepo.findAll();
    }
    @RequestMapping("/gamePlayers")
    public List<GamePlayer> getGamePlayers () {return gamePlayerRepo.findAll();}
}
