package salvo.salvo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;

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

    @RequestMapping("/games")
          public List<Object> getGames() {
        //Queremos hacer un loop, pero el for no vale, uaremos un stream que e  si mismo tambien es un loop.
        //Para ello lo primero que haremos es busacr toda la infomacion de Games con .findAll().
        //Luego convertimos el gameRepo.findAll() en un stream, esté puede tener muchas funcionalidades como por ejemplo:
        //filtrate(),map(), sorted(). Usamos map que nos servira para que nos devuelva un objecto ÚNICO, es decir, que no este repetido,
        //Pongamos de ejemplo [1, 2, 3, 3], el map solo devolveria [1, 2, 3].
        //A esté le pasamos que la info que debe cojer la encontrara en la funcion gameInfo.
        //Para acabar hacemos un .collect(toList()) para volvero a convertir en lista.

        return gameRepo.findAll().stream()
                .map(game -> gameInfo(game))
                .collect(toList());
    }
    //Este metodo Map nos generara el Mapa de String y Objetos que necesitamos, le decimos que depende de la Clase Game.
    //Y le decimos que debe cojer cierta información del getGamplePLay que le pusimos en la clase Game.
    //Como hemos hecho hasta el momento le creamos un id, un date y le añadimos un gamePlayer.
    //Este gamePlayer tambien sera un stream y haremos lo mismo en la funcion gamePlayInfo.
    public Map<String, Object> gameInfo(Game game){
        Set<GamePlayer> gplayers = game.getGamePlayers();
        Map<String , Object> gameMap = new LinkedHashMap<>();
        gameMap.put("id", game.getId());
        gameMap.put("created", game.getDate());
        gameMap.put("gameplayers", gplayers.stream()
                                            .map(gp->gamePlayerInfo(gp))
                                            .collect(toList()));
        return gameMap;
    }
    //Si nos fijamos bien siempre estamos haciendo lo mismo nesteando un stream en otra,
    // pero en lugar de hacerlo con lops lo hacemos con streams
    public Map<String, Object> gamePlayerInfo (GamePlayer gplayer) {
        Map<String, Object> gamePlayerMap = new LinkedHashMap<>();
        gamePlayerMap.put("id", gplayer.getId());
        gamePlayerMap.put("player", playerInfo(gplayer.getPlayer()));
        gamePlayerMap.put("score", gplayer.getScore().getScore());
        return gamePlayerMap;
    }
    public Map<String, Object> playerInfo (Player player) {
        Map<String, Object> playerMap = new LinkedHashMap<>();
        playerMap.put("id", player.getId());
        playerMap.put("email", player.getUserName());

        return playerMap;
    }
//    public Map<String, Object> scoreInfo (Score score) {
//        Map<String,Object> scoreMap = new LinkedHashMap<>();
//        scoreMap.put("score", score.getScore());
//        return scoreMap;
//    }

    public Map<String, Object> gameViewInfo(GamePlayer gamePlayer){
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
    public Map<String,Object> shipInfo (Ship ship) {
        Map<String,Object> shipMap = new LinkedHashMap<>();
        shipMap.put("type", ship.getType());
        shipMap.put("location", ship.getLoactions());
        return shipMap;
    }
    public List<Object> salvoInfo (GamePlayer gamePlayer) {
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


