package salvo.salvo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.*;
import static java.util.stream.Collectors.toList;


@RestController
@RequestMapping("/api")
public class SalvoController {

    @Autowired
    private GameRepository gameRepo;
    @Autowired
    private PlayerRepository playerRepo;
    @Autowired
    private GamePlayerRepository gamePlayerRepo;
    @Autowired
    private ShipRepository shipRepo;
    @Autowired
    private SalvoRepository salvoRepo;
    @Autowired
    private ScoreRepository scoreRepo;

    @RequestMapping("/leaderboard")
    public List<Object> getLeaderBoard () {
        return playerRepo.findAll().stream()
                                    .map(p -> playerInfo2(p))
                                    .collect(toList());
    }
    private Map<String, Object> gamePlayerInfo2 (GamePlayer gplayer) {
        Map<String, Object> gamePlayerMap = new LinkedHashMap<>();
        if(gplayer.getScore() != null) {
            gamePlayerMap.put("score", gplayer.getScore().getScore());
        } else {
            gamePlayerMap.put("score", null);
        }
        return gamePlayerMap;
    }
    private Map<String, Object> playerInfo2 (Player player) {
        Set<GamePlayer> gplayers = player.getGamePlayers();
        Map<String, Object> playerMap = new LinkedHashMap<>();
        playerMap.put("id", player.getId());
        playerMap.put("email", player.getUserName());
        playerMap.put("gameplayers" ,gplayers.stream()
                                        .map(gp->gamePlayerInfo2(gp))
                                        .collect(toList()));
        return playerMap;
    }
    @RequestMapping(path = "/players", method = RequestMethod.POST)
    public ResponseEntity<Map<String,Object>> createPlayer (String userName, String password) {
        if (userName.isEmpty()) {
            return new ResponseEntity<>(makeMap("error","No Name"), HttpStatus.FORBIDDEN);
        }
        if (password.isEmpty()) {
            return new ResponseEntity<>(makeMap("error","No Password"), HttpStatus.FORBIDDEN);
        }
        List<Player> players = playerRepo.findByUserName(userName);
        if (!players.isEmpty()) {
            return new ResponseEntity<>(makeMap("error","Existing User"), HttpStatus.CONFLICT);
        }
        Player player = playerRepo.save(new Player(userName, password));
        return new ResponseEntity<>(makeMap("id", player.getId()), HttpStatus.CREATED);

    }
    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }
    @RequestMapping("/games")
    public Map<String,Object> getGames(Authentication authentication) {
        //Queremos hacer un loop, pero el for no vale, uaremos un stream que e  si mismo tambien es un loop.
        //Para ello lo primero que haremos es busacr toda la infomacion de Games con .findAll().
        //Luego convertimos el gameRepo.findAll() en un stream, esté puede tener muchas funcionalidades como por ejemplo:
        //filtrate(),map(), sorted(). Usamos map que nos servira para que nos devuelva un objecto ÚNICO, es decir, que no este repetido,
        //Pongamos de ejemplo [1, 2, 3, 3], el map solo devolveria [1, 2, 3].
        //A esté le pasamos que la info que debe cojer la encontrara en la funcion gameInfo.
        //Para acabar hacemos un .collect(toList()) para volvero a convertir en lista.
        Map<String,Object> gameMap = new LinkedHashMap<>();
        if (authentication != null) {
            gameMap.put("player", authentication.getName());
            gameMap.put("games", gameRepo.findAll().stream()
                    .map(game -> gameInfo(game))
                    .collect(toList()));
        } else {
            gameMap.put("Error", "No authentication");
        }
        return gameMap;
    }
    @RequestMapping( path = "/createGame", method = RequestMethod.POST)
    private ResponseEntity<Map<String,Object>> createGamePlayer (Authentication authentication) {
        String playerName = authentication.getName();
        Player player = playerRepo.findByUserName(playerName).get(0);
        Game newGame = new Game();
        gameRepo.save(newGame);
        GamePlayer gamePlayer = new GamePlayer(player, newGame);
        gamePlayerRepo.save(gamePlayer);

        return new ResponseEntity<>(makeMap("gpId",gamePlayer.getId()), HttpStatus.CREATED);
    }
    @RequestMapping(path = "/games/{gameId}/players", method = RequestMethod.POST)
    public ResponseEntity<Map<String,Object>> joinGame(@PathVariable Long gameId, Authentication authentication) {
        String playerName = authentication.getName();
        Player player = playerRepo.findByUserName(playerName).get(0);
        Game newGameId = gameRepo.findOne(gameId);
        GamePlayer gamePlayer = new GamePlayer(player, newGameId);
        gamePlayerRepo.save(gamePlayer);

        return new ResponseEntity<>(makeMap("gpId",gamePlayer.getId()), HttpStatus.CREATED);
    }
    private Map<String, Object> gameInfo(Game game){
        //Este metodo Map nos generara el Mapa de String y Objetos que necesitamos, le decimos que depende de la Clase Game.
        //Y le decimos que debe cojer cierta información del getGamplePLay que le pusimos en la clase Game.
        //Como hemos hecho hasta el momento le creamos un id, un date y le añadimos un gamePlayer.
        //Este gamePlayer tambien sera un stream y haremos lo mismo en la funcion gamePlayInfo.
        Set<GamePlayer> gplayers = game.getGamePlayers();
        Map<String , Object> gameMap = new LinkedHashMap<>();
        gameMap.put("id", game.getId());
        gameMap.put("created", game.getDate());
        gameMap.put("gameplayers", gplayers.stream()
                .map(gp->gamePlayerInfo(gp))
                .collect(toList()));
        return gameMap;
    }
    private Map<String, Object> gamePlayerInfo (GamePlayer gplayer) {
        //Si nos fijamos bien siempre estamos haciendo lo mismo nesteando un stream en otra,
        // pero en lugar de hacerlo con lops lo hacemos con streams
        Map<String, Object> gamePlayerMap = new LinkedHashMap<>();
        gamePlayerMap.put("id", gplayer.getId());
        gamePlayerMap.put("player", playerInfo(gplayer.getPlayer()));
        if(gplayer.getScore() != null) {
            gamePlayerMap.put("score", gplayer.getScore().getScore());
        } else {
            gamePlayerMap.put("score", null);
        }
        return gamePlayerMap;
    }
    private Map<String, Object> playerInfo (Player player) {
        Map<String, Object> playerMap = new LinkedHashMap<>();
        playerMap.put("id", player.getId());
        playerMap.put("email", player.getUserName());

        return playerMap;
    }
    private Map<String, Object> gameViewInfo(GamePlayer gamePlayer){
        Map<String , Object> gameMap = new LinkedHashMap<>();
        gameMap.put("id", gamePlayer.getGame().getId());
        gameMap.put("gpid", gamePlayer.getId());
        gameMap.put("created", gamePlayer.getGame().getDate());
        gameMap.put("gameplayers", gamePlayer.getGame().getGamePlayers().stream()
                .map(gp ->gamePlayerInfo(gp))
                .collect(toList()));
        gameMap.put("ships", gamePlayer.getShips().stream()
                .map(ship -> shipInfo(ship))
                .collect(toList()));
        gameMap.put("salvos", gamePlayer.getGame().getGamePlayers().stream()
                .map(gp -> salvoInfo(gp))
                .collect(toList()));
        return gameMap;
    }
    private Map<String,Object> shipInfo (Ship ship) {
        Map<String,Object> shipMap = new LinkedHashMap<>();
        shipMap.put("type", ship.getType());
        shipMap.put("location", ship.getLoactions());
        return shipMap;
    }
    private List<Object> salvoInfo (GamePlayer gamePlayer) {
        Set<Salvo> salvos = gamePlayer.getSalvos();
        List<Object> listSalvo = new ArrayList<>();
        for (Salvo salvo : salvos) {
            Map<String,Object> salvoMap = new LinkedHashMap<>();
            salvoMap.put("player",salvo.getGamePlayer().getId());
            salvoMap.put("turn",salvo.getTurn());
            salvoMap.put("location",salvo.getLocations());
            listSalvo.add(salvoMap);
        }
        return listSalvo;
    }
    @RequestMapping("/game_view/{gamePlayerId}")
    public Map<String,Object> getGameMap (@PathVariable Long gamePlayerId) {
        Map<String,Object> gamePlayerIdMap = gameViewInfo(gamePlayerRepo.getOne(gamePlayerId));
        if (gamePlayerId != null) {
            return gamePlayerIdMap;
        }else {
            return null;
        }
    }
}


