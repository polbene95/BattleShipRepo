package salvo.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Entity
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private Date date;

    @OneToMany(mappedBy = "game", fetch = FetchType.EAGER)
    Set<GamePlayer> gamePlayers;

    public void addGamePlayer (GamePlayer gamePlayer) {
        gamePlayer.setGame(this);
        gamePlayers.add(gamePlayer);
    }
    public List<Player> getPlayers () {
        return gamePlayers.stream().map(sub -> sub.getPlayer()).collect(toList());
    }

    public Game () {}
    public Game (Date date) {
        this.date = date;

    }

    public long getId() {
        return id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
