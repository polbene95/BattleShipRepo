package salvo.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;
import java.util.Set;


import static java.util.stream.Collectors.toList;


@Entity
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String userName;
    private String password;
    @JsonIgnore
    public List<Game> getGames () {
        return gamePlayers.stream().map(sub -> sub.getGame()).collect(toList());
    }
    @OneToMany(mappedBy = "player", fetch = FetchType.EAGER)
    Set<GamePlayer> gamePlayers;
    @OneToMany(mappedBy = "player", fetch = FetchType.EAGER)
    Set<Score> scores;
    public void addGamePlayer (GamePlayer gamePlayer) {
        gamePlayer.setPlayer(this);
        gamePlayers.add(gamePlayer);
    }
    public void addScore (Score score) {
        score.setPlayer(this);
        scores.add(score);
    }
    public Player () { }
    public Player (String userName, String password) {
        this.userName = userName;
        this.password = password;
    }
    public long getId() {
        return id;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    @JsonIgnore
    public Set<Score> getScores() {
        return scores;
    }
    @JsonIgnore
    public Score getScore(Game game) {
        return scores.stream()
                .filter(s -> s.getGame().equals(game))
                .findFirst()
                .orElse(null);
    }
    public Set<GamePlayer> getGamePlayers() {
        return gamePlayers;
    }
}

