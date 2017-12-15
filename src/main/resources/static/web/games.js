$(document).ready(function () {
    $("#logout-form").hide();
    $.getJSON("http://localhost:8080/api/leaderboard", function (json) {
        data = json;
        printList();
        $('#rank-table').DataTable();
    });
//    reloadApiGames();
    $("#list-table").hide();
});
//window.onunload = logout();
function reloadApiGames() {
    $.getJSON("http://localhost:8080/api/games", function (json) {
        data2 = json;
        printGameList();
        //        $('#list-table').DataTable();
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


            totalScore += score;
            if (score == 1) {
                winArr.push(score);
                winNum = winArr.length;
            }
            if (score == 0) {
                loseArr.push(score);
                loseNum = loseArr.length;
            }
            if (score == 0.5) {
                tieArr.push(score);
                tieNum = tieArr.length;
            }
            row.insertCell().innerHTML = email;
            row.insertCell().innerHTML = totalScore;
            row.insertCell().innerHTML = winNum;
            row.insertCell().innerHTML = loseNum;
            row.insertCell().innerHTML = tieNum;
        }
        console.log(score);
        tbody.append(row);
    }
    console.log(winArr);
    console.log(loseArr);
    console.log(tieArr);
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
            reloadApiGames();
            $("#list-table").hide();
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
    var games = data2.games;
    var user = data2.player;
    for (i = 0; i < games.length; i++) {
        for (j = 0; j < games[i].gameplayers.length; j++) {
            var row = document.createElement("tr");
            var col = document.createElement("td");
            var button = document.createElement("button");
            button.setAttribute("type", "button");

            var gameId = games[i].id;
            var host = games[i].gameplayers[0].player.email;
            var guest = games[i].gameplayers[1].player.email;
            var gameplayers = games[i].gameplayers.length;

            row.insertCell().innerHTML = gameId;
            row.insertCell().innerHTML = host;
            row.insertCell().innerHTML = guest;
            if (gameplayers == 2) {
                if (host == user || guest == user) {
                    button.setAttribute("class", "play");
                    button.innerHTML = "PLAY";
                    row.append(button);
                } else {
                    button.innerHTML = "VIEW";
                    row.append(button);
                }
            }
            if (gameplayers == 1 && host == user) {
                button.setAttribute("class", "play");
                button.innerHTML = "PLAY";
                row.append(button);
            }
            if (gameplayers == 1 && guest == user) {
                button.innerHTML = "JOIN";
                row.append(button);
            }
        }
        tbody.append(row);
    }
}
//
//    var olMain = document.createElement("ol");
//    var olGamePlayers = document.createElement("ol");
//    var olPlayers1 = document.createElement("ol");
//    var olPlayers2 = document.createElement("ol");
//    var liId = document.createElement("li");
//    var liCreated = document.createElement("li");
//    var liGamePlayerId0 = document.createElement("li");
//    var liGamePlayerId1 = document.createElement("li");
//    var liPlayerId1 = document.createElement("li");
//    var liPlayerId2 = document.createElement("li");
//    var liPlayerEmail1 = document.createElement("li");
//    var liPlayerEmail2 = document.createElement("li");
//
//
//    var gameId = data[i].id;
//    var gameCreated = data[i].created;
//    var gameGamePlayerId0 = data[i].gameplayers[0].id;
//    var gameGamePlayerId1 = data[i].gameplayers[1].id;
//    var playerId1 = data[i].gameplayers[0].player.id;
//    var playerId2 = data[i].gameplayers[1].player.id;
//    var playerEmail1 = data[i].gameplayers[0].player.email;
//    var playerEmail2 = data[i].gameplayers[1].player.email;
//
//    liId.innerHTML = gameId;
//    liCreated.innerHTML = gameCreated;
//    liGamePlayerId0.innerHTML = gameGamePlayerId0;
//    liGamePlayerId1.innerHTML = gameGamePlayerId1;
//    liPlayerId1.innerHTML = playerId1;
//    liPlayerId2.innerHTML = playerId2;
//    liPlayerEmail1.innerHTML = playerEmail1;
//    liPlayerEmail2.innerHTML = playerEmail2;
//
//
//    olPlayers1.append(liPlayerId1);
//    olPlayers1.append(liPlayerEmail1);
//    olPlayers2.append(liPlayerId2);
//    olPlayers2.append(liPlayerEmail2);
//    olMain.append(liId);
//    olMain.append(liCreated);
//    olMain.append(olGamePlayers);
//    olGamePlayers.append(liGamePlayerId0);
//    olGamePlayers.append(olPlayers1);
//    olGamePlayers.append(liGamePlayerId1);
//    olGamePlayers.append(olPlayers2);
//    gameList.append(olMain);
//
//    var game = data[i];
//    for (j = 0; j < game.gameplayers.length; j++) {
//        var row = document.createElement("tr");
//        var col = document.createElement("td");
//        var gamePlayer = game.gameplayers[j];
//        var email = gamePlayer.player.email;
//        var score = gamePlayer.score;
//        if (!emailArr.includes(email)) {
//            emailArr.push(email);
//            row.insertCell().innerHTML = email;
//        }
//        if (gamePlayer.player.id === 1) {
//            console.log(score);
//            totalScore += score;
//            row.insertCell().innerHTML = totalScore;
//            if (score === 1) {
//                totalWin.push(score);
//                var numWin = totalWin.length;
//            }
//            if (score === 0.5) {
//                totalLose.push(score);
//                var numLose = totalLose.length;
//            }
//            if (score === 0) {
//                totalTie.push(score);
//                var numTie = totalTie.length
//            }
//            row.insertCell().innerHTML = numWin;
//            row.insertCell().innerHTML = numLose;
//            row.insertCell().innerHTML = numTie;
//
//        }
//        row.appendChild(col);
//        tbody.appendChild(row);
//    }


//    console.log("totalScore", totalScore);
