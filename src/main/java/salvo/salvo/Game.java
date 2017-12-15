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

    public List<Player> getPlayers () {
        return gamePlayers.stream().map(sub -> sub.getPlayer()).collect(toList());
    }

    @OneToMany(mappedBy = "game", fetch = FetchType.EAGER)
    Set<GamePlayer> gamePlayers;

    @OneToMany(mappedBy = "game", fetch = FetchType.EAGER)
    Set<Score> scores;

    public void addGamePlayer (GamePlayer gamePlayer) {
        gamePlayer.setGame(this);
        gamePlayers.add(gamePlayer);
    }
    public void addScore (Score score) {
        score.setGame(this);
        scores.add(score);
    }

    public Game () {
        this.date = new Date();

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

    public Set<GamePlayer> getGamePlayers() {
        return gamePlayers;
    }
}
