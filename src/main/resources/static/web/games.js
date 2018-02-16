$(document).ready(function () {
    $("#logout-form").hide();
    $("#list-table").hide();
    mainPageNav();
    
    $.getJSON("http://localhost:8080/api/leaderboard", function (json) {
        data = json;
        printList();
        $('#rank-table').show();
//        $('#games-button').hide();
        $('#rank-table').DataTable({
            "order": [[1, "desc"]]
        });
    });
    $.getJSON("http://localhost:8080/api/games", function (json) {
        data2 = json;
        printGameList();
        userLoged();
    })
//    reloadApiGames();
});

function reloadApiGames() {
    $.getJSON("http://localhost:8080/api/games", function (json) {
        data2 = json;
//        printGameList();
//        userLoged();
    })
}

function printList() {
    console.log(data);

    var tbody = document.getElementById("tbody");
    for (i = 0; i < data.length; i++) {
        var totalScore = 0;
        var winArr = [];
        var loseArr = [];
        var tieArr = [];
        var winNum = 0;
        var loseNum = 0;
        var tieNum = 0;
        for (j = 0; j < data[i].gameplayers.length; j++) {
            var row = document.createElement("tr");
            var col = document.createElement("td");
            var email = data[i].email;
            var score = data[i].gameplayers[j].score;
            console.log("score",score);
            if (data[i].gameplayers[j].score != null) {

                totalScore += score;
                if (score == 1) {
                    winArr.push(score);
                    winNum = winArr.length;
                    console.log("imin");
                }
                if (score == 0) {
                    loseArr.push(score);
                    loseNum = loseArr.length;
                }
                if (score == 0.5) {
                    tieArr.push(score);
                    tieNum = tieArr.length;
                }
            }

            row.insertCell().innerHTML = email;
            row.insertCell().innerHTML = totalScore;
            row.insertCell().innerHTML = winNum;
            row.insertCell().innerHTML = loseNum;
            row.insertCell().innerHTML = tieNum;
        }
//        console.log(score);
        tbody.append(row);
    }
//    console.log(winArr);
//    console.log(loseArr);
//    console.log(tieArr);
}

function login() {

    var userName = document.getElementById("textname");
    var password = document.getElementById("textpassword");

    $.post("/api/login", {
            username: userName.value,
            password: password.value
        })
        .done(function () {
            reloadApiGames();
            userName.value = "";
            password.value = "";
            $("#login-form").hide();
            $("#logout-form").show();
            $("#list-table").show();
            
        })
        .fail(function () {
            alert("Invalid User or Password");
        });

    var nameTxt = document.getElementById("welcome-txt");
    nameTxt.innerHTML = "Welcome " + userName.value;

}

function logout() {
    $.post("/api/logout")
        .done(function () {
            $("#logout-form").hide();
            $("#login-form").show();
            $("#list-table").hide();
            reloadApiGames();
            location.reload();
        })
        .fail(function () {
            alert("Impossible to log out, try Hard-Refresh (Ctrl + Shift + R)");
        });
}

function signup() {
    var userName = document.getElementById("textname");
    var password = document.getElementById("textpassword");

    $.post("/api/players", {
            userName: userName.value,
            password: password.value
        })
        .done(function (message) {
            alert("New User created!");
            console.log(message);
            login();
        })
        .fail(function (message) {
            alert(message.responseJSON.error);
            console.log(message);
        });
}

function printGameList() {
    console.log(data2);
    var tbody = document.getElementById("list-info");
    var user = data2.player;
    var games = data2.games;
    for (i = 0; i < games.length; i++) {
        for (j = 0; j < games[i].gameplayers.length; j++) {
            var row = document.createElement("tr");
            var col = document.createElement("td");
            var button = document.createElement("a");
            button.setAttribute("type", "button");

            var gameplayers = games[i].gameplayers.length;
            var gameId = games[i].id;
            var host = games[i].gameplayers[0].player.email;
            var gpIdHost = games[i].gameplayers[0].id;
            if (gameplayers == 2) {
                var guest = games[i].gameplayers[1].player.email;
                var gpIdGuest = games[i].gameplayers[1].id;
            } else {
                var guest = "Join if you want to play";
                var gpIdGuest = null;
            }

            row.insertCell().innerHTML = gameId;
            row.insertCell().innerHTML = host;
            row.insertCell().innerHTML = guest;
            if (guest != null) {
                if (gameplayers == 2) {
                    if (host == user) {
                        button.setAttribute("class", "play btn");
                        button.setAttribute("href", "http://localhost:8080/web/game.html?gp=" + gpIdHost);
                        button.innerHTML = "PLAY";
                    } else if (guest == user) {
                        button.setAttribute("class", "play btn");
                        button.setAttribute("href", "http://localhost:8080/web/game.html?gp=" + gpIdGuest);
                        button.innerHTML = "PLAY";
                    } else {
                        button.setAttribute("class", "play btn");
                        button.innerHTML = "IN GAME";
                    }
                }
                if (gameplayers == 1 && host == user) {
                    button.setAttribute("class", "play btn");
                    button.setAttribute("href", "http://localhost:8080/web/game.html?gp=" + gpIdHost);
                    button.innerHTML = "PLAY";
                }
                if (gameplayers == 1 && host !== user) {
                    button.setAttribute("class", "play btn");
                    //                    button.setAttribute("data-id", gameId);
                    button.setAttribute("onclick", "joinGame(" + gameId + ")");
                    button.innerHTML = "JOIN";
                }
            }
            col.append(button);
            row.append(col);
        }
        tbody.append(row);
    }
}

function createGame() {
    var createGameButton = document.getElementById("create-game");
    $.post("/api/createGame")
        .done(function () {
            var games = data2.games;
            for (i = 0; i < games.length; i++) {
                for (j = 0; j < games[i].gameplayers.length; j++) {
                    var newGamePlayerId = games[games.length - 1].gameplayers[0].id;
                    window.location.href = "http://localhost:8080/web/game.html?gp=" + newGamePlayerId;
//                    createGameButton.setAttribute("href", "http://localhost:8080/web/game.html?gp=" + newGamePlayerId);
                    console.log(newGamePlayerId);
                }
            }
            reloadApiGames();
//            location.reload();
            console.log("done");

        })
        .fail(function () {
            console.log("fail")
        });
}

function userLoged() {
    var user = data2.player;
    if (data2.player !== null) {
        $("#login-form").hide();
        $("#logout-form").show();
//        $("#list-table").show();
        $('#games-button').show();
        $('#list-table').hide();

        var nameTxt = document.getElementById("welcome-txt");
        nameTxt.innerHTML = "Welcome " + user;
    } else {
        $("#logout-form").hide();
        $("#login-form").show();
        $("#list-table").hide();
    }
}

function joinGame(gameId) {
    $.post("/api/games/" + gameId + "/players", ).done(function (response) {
        location.replace("/web/game.html?gp=" + response.gpId);
        console.log(response);
        console.log("join done");
    }).fail(function () {
        console.log("fail join");
    })
}

function mainPageNav() {

    $("#rank-button").on("click", function () {
        $(".title h1").text("");
        $(".title h1").text("Rank Table");
        $("#list-table").hide();
        $("#rank-table").show();
    });
    
    $("#games-button").on("click", function () {
        $(".title h1").text("");
        $(".title h1").text("List of Games");
        $("#rank-table").hide();
        $("#list-table").show();
    })

}
