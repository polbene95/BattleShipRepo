package salvo.salvo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@RestController
@RequestMapping("/api")
public class SalvoController {

    @Autowired
    private GameRepository gameRepo;
    private PlayerRepository playerRepo;
    private GamePlayerRepository gamePlayerRepo;
//
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
                                            .map(gamePlayer ->gamePlayerInfo(gamePlayer))
                                            .collect(toList()));
        return gameMap;
    }
    //Si nos fijamos bien siempre estamos haciendo lo mismo nesteando un stream en otra,
    // pero en lugar de hacerlo con lops lo hacemos con streams
    public Map<String, Object> gamePlayerInfo (GamePlayer gplayer) {
        Map<String, Object> gamePlayerMap = new LinkedHashMap<>();
        gamePlayerMap.put("id", gplayer.getId());
        gamePlayerMap.put("player", playerInfo(gplayer.getPlayer()));
        return gamePlayerMap;
    }
    public Map<String, Object> playerInfo (Player player) {
        Map<String, Object> playerMap = new LinkedHashMap<>();
        playerMap.put("id", player.getId());
        playerMap.put("email", player.getUserName());
        return playerMap;
    }
}


