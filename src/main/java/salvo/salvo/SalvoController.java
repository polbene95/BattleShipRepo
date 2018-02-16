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
    allSunk(gplayer);
        Map<String, Object> gamePlayerMap = new LinkedHashMap<>();
        if(gplayer.getScore() != null) {
            gamePlayerMap.put("gpId", gplayer.getId());
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
//        if (password.isEmpty()) {
//            return new ResponseEntity<>(makeMap("error","No Password"), HttpStatus.FORBIDDEN);
//        }
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
        //Queremos hacer un loop, pero el for no vale, uaremos un stream que tambien es un loop.
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
        Map<String , Object> gameMap = new LinkedHashMap<>();
        Set<GamePlayer> gplayers = game.getGamePlayers();
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
        sinkShip(gamePlayer);
//        gameOverWin(gamePlayer);
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
                .map(gp -> enemySalvo(gp) )
                .collect(toList()));
        gameMap.put("history", gamePlayer.getGame().getGamePlayers().stream()
                .map(gp -> shipLocEnemyInfo(gp))
                .collect(toList()));
        gameMap.put("hits", gamePlayer.getSalvos().stream()
                .map(salvo -> getHits(salvo))
                .collect(toList()));

        return gameMap;

    }

    private GamePlayer getEnemyPlayer(GamePlayer gamePlayer) {

        //Creamos 3 variables: el id del gamePlayer que vemos ahora, el game en el que juega dicho player y los gamePlayers del game
        Long playerId = gamePlayer.getId();
        Game game = gamePlayer.getGame();
        Set<GamePlayer> gamePlayers = game.getGamePlayers();

        //Ahora para cojer el otro gamePlayer simplemente comparamos el id de los gamePlayers con la primera variable que hemos creado,
        // cuando fialtramos lo que le decimos que nos coja el id del gamePlayer que no coincida con la primera variable que declaramos.
        GamePlayer enemyPlayer = gamePlayers.stream()
                .filter(gp -> gp.getId() != playerId).findAny().orElse(null);

        return enemyPlayer;
    }
    private List<String> getShipsLocations(GamePlayer gamePlayer) {
        //Agrupamos todos los ship de un gamePlayer en un Set
        Set<Ship> ships = gamePlayer.getShips();
        //De ese Set cojeremos la location de los ship y crearemos un flatMap que nos permite pasar todas las location en un solo grupo de locations, es decir,
        // si tenemos [h1,h2,h3],[b1,b2,b3],[j1,j2,j3] pasamos a [h1,h2,h3,b1,b2,b3,j1,j2,j3]. Usamos de nomenclatura cells (celda de la tabla).
        return ships.stream()
                .map(ship -> ship.getLocations())
                .flatMap(cells -> cells.stream()).collect(toList());
    }
    private List<String> getSalvoLocations(GamePlayer gamePlayer) {
        //Al igual que con las locations de los Ship ahora lo hacemos con los salvos, para más adelante poder comparar ambos flatMaps.
        return gamePlayer.getSalvos().stream()
                .map(salvo -> salvo.getLocations())
                .flatMap(cells -> cells.stream()).collect(toList());
    }
    private List<String> getHits(Salvo salvo) {
        //En este metodo vamos a comprobar si el salvo es hit o fail.
        //Lo primero es cojer los salvos del gamePlayer contrario a nosotros.
        GamePlayer enemy = getEnemyPlayer(salvo.getGamePlayer());
        //Si dicho enemigo existe (no estamos esperando que se una otro gamePlayer)
        if (enemy != null) {

            //Cojemos nustros salvos y los barcos del enemigo y miramos para todos nuestros salvos si alguno de sus barcos tiene la misma cell.
            //Si la contiene return dicha cell para, desde el front, poder pintarla.
            List<String> salvoLocations = salvo.getLocations();
            List<String> ShipLocations = getShipsLocations(enemy);

            return salvoLocations.stream()
                    .filter(cell -> ShipLocations.contains(cell))
                    .collect(toList());
        } else return null;
    }

    private boolean shipIsSunk(List<String> playerSalvos, Ship ship) {
        //Ahora miramos si la location de un Ship coincide con los salvos que hemos realizado con el .allMatch()
        boolean shipIsSunk = ship.getLocations().stream()
                .allMatch(locations -> playerSalvos.contains(locations));
                if (shipIsSunk) {
                    ship.setSunk(true);
                    shipRepo.save(ship);
                }
        return shipIsSunk;
    }
    private void sinkShip(GamePlayer gamePlayer) {

        GamePlayer enemy = getEnemyPlayer(gamePlayer);

        //Si, viniendo del metodo anterior, los salvos coinciden con la location de un ship,
        // cambiamos el sunk por true, infromandonos que el barco esta undido.

        if (enemy != null) {
            GamePlayer enemyPlayer = getEnemyPlayer(gamePlayer);
            Set<Ship> enemyShips = enemyPlayer.getShips();
            List<String> playerSalvos = getSalvoLocations(gamePlayer);
            enemyShips.stream().filter(ship -> !ship.isSunk())
                    .forEach(ship -> {
                        shipIsSunk(playerSalvos, ship);
                    });
        }
        allSunk(gamePlayer);
    }

    private void allSunk (GamePlayer gamePlayer) {
        GamePlayer enemy = getEnemyPlayer(gamePlayer);
        GamePlayer user = gamePlayer;

        if (enemy != null) {

            GamePlayer enemyPlayer = getEnemyPlayer(gamePlayer);
            Set<Ship> enemyShips = enemyPlayer.getShips();
            Set<Ship> userShips = gamePlayer.getShips();
            List<String> arrayOfSunkEnemy = new ArrayList<>();
            List<String> arrayOfSunkUser = new ArrayList<>();
            for (Ship ship : enemyShips) {
                if (ship.isSunk()) {
                    arrayOfSunkEnemy.add(ship.getType());
                }
            }
            for (Ship ship: userShips) {
                if(ship.isSunk()){
                    arrayOfSunkUser.add(ship.getType());
                }
            }
            if(arrayOfSunkEnemy.size() == 4) {
                Score scoreUser = new Score(1, gamePlayer.getPlayer(), gamePlayer.getGame());
                Score scoreEnemy = new Score(0, enemy.getPlayer(), enemy.getGame());
                scoreRepo.save(scoreUser);
                scoreRepo.save(scoreEnemy);
            }
            if (arrayOfSunkUser.size() == 4) {
                Score scoreUser = new Score(0, gamePlayer.getPlayer(), gamePlayer.getGame());
                Score scoreEnemy = new Score(1, enemy.getPlayer(), enemy.getGame());
                scoreRepo.save(scoreUser);
                scoreRepo.save(scoreEnemy);
            }
        }
    }

    private Map<String, Object> shipLocEnemyInfo (GamePlayer gamePlayer) {
        Map<String, Object> gamePlayerMap = new HashMap<>();

        gamePlayerMap.put("gamePlayerId", gamePlayer.getId());
        gamePlayerMap.put("shipStatus", gamePlayer.getShips().stream()
                        .map(ship -> shipLocInfo(ship))
                        .collect(toList()));


        return gamePlayerMap;
    }
    private Map<String,Object> shipLocInfo (Ship ship) {
        Map<String,Object> shipMap = new LinkedHashMap<>();

        shipMap.put("type", ship.getType());
        shipMap.put("sunk", ship.isSunk());
        return shipMap;
    }

    private Map<String,Object> shipInfo (Ship ship) {
        Map<String,Object> shipMap = new LinkedHashMap<>();
        shipMap.put("type", ship.getType());
        shipMap.put("location", ship.getLocations());
        return shipMap;
    }
    private List<Object> enemySalvo (GamePlayer gamePlayer){
        List<Object> enemySalvo = new ArrayList();
        Set<Salvo> salvos = gamePlayer.getSalvos();

        for (Salvo salvo : salvos) {
            Map<String,Object> enemySalvoMap = new LinkedHashMap<>();
            enemySalvoMap.put("player", salvo.getGamePlayer().getId());
            enemySalvoMap.put("turn",salvo.getTurn());
            enemySalvoMap.put("location", salvo.getLocations());
            enemySalvo.add(enemySalvoMap);
        }
        return enemySalvo;
    }
    @RequestMapping("/game_view/{gamePlayerId}")
    public Map<String,Object> getGameMap (@PathVariable Long gamePlayerId, Authentication authentication) {
        Map<String,Object> gamePlayerIdMap = gameViewInfo(gamePlayerRepo.getOne(gamePlayerId));
            if (gamePlayerId != null && authentication != null) {
                return gamePlayerIdMap;
            } else {
                return null;
            }
    }
    @RequestMapping(path = "/games/players/{gamePlayerId}/ships" , method = RequestMethod.POST)
    public ResponseEntity<Map<String,Object>> createShips (@PathVariable Long gamePlayerId,
                                                           @RequestBody Set<Ship> ships,
                                                           Authentication authentication
                                                           ) {

        if (authentication != null) {

            GamePlayer gamePlayer = gamePlayerRepo.getOne(gamePlayerId);
            for (Ship ship : ships) {
                ship.setGamePlayer(gamePlayer);
                shipRepo.save(ship);
            }
            return new ResponseEntity<>(makeMap("succed", "ship created"), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(makeMap("error", "forbidden"), HttpStatus.FORBIDDEN);
        }
    }
    @RequestMapping(path = "/games/players/{gamePlayerId}/salvos", method = RequestMethod.POST)
    public ResponseEntity<Map<String,Object>> createSalvos (@PathVariable Long gamePlayerId,
                                                            @RequestBody Salvo salvo,
                                                            Authentication authentication) {
        if (authentication != null) {
            GamePlayer gamePlayer = gamePlayerRepo.getOne(gamePlayerId);
            salvo.setGamePlayer(gamePlayer);
            salvoRepo.save(salvo);
            return new ResponseEntity<>(makeMap("Shots", "Done"), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(makeMap("error", "forbidden"), HttpStatus.FORBIDDEN);
        }
    }
}







