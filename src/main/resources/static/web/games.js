$(document).ready(function () {
    $.getJSON("http://localhost:8080/api/games", function (json) {
        data = json;
        printList();
        console.log(data);
    });
});

function printList() {
    var gameList = document.getElementById("gameslist");
    for (i = 0; i < data.length; i++) {
        var olMain = document.createElement("ol");
        var olGamePlayers = document.createElement("ol");
        var olPlayers1 = document.createElement("ol");
        var olPlayers2 = document.createElement("ol");
        var liId = document.createElement("li");
        var liCreated = document.createElement("li");
        var liGamePlayerId0 = document.createElement("li");
        var liGamePlayerId1 = document.createElement("li");
        var liPlayerId1 = document.createElement("li");
        var liPlayerId2 = document.createElement("li");
        var liPlayerEmail1 = document.createElement("li");
        var liPlayerEmail2 = document.createElement("li");
        
        
        var gameId = data[i].id;
        var gameCreated = data[i].created;
        var gameGamePlayerId0 = data[i].gameplayers[0].id;
        var gameGamePlayerId1 = data[i].gameplayers[1].id;
        var playerId1 = data[i].gameplayers[0].player.id;
        var playerId2 = data[i].gameplayers[1].player.id;
        var playerEmail1 = data[i].gameplayers[0].player.email;
        var playerEmail2 = data[i].gameplayers[1].player.email;
        
        liId.innerHTML = gameId;
        liCreated.innerHTML = gameCreated;
        liGamePlayerId0.innerHTML = gameGamePlayerId0;
        liGamePlayerId1.innerHTML = gameGamePlayerId1;
        liPlayerId1.innerHTML = playerId1;
        liPlayerId2.innerHTML = playerId2;
        liPlayerEmail1.innerHTML = playerEmail1;
        liPlayerEmail2.innerHTML = playerEmail2;
        
        
        olPlayers1.append(liPlayerId1);
        olPlayers1.append(liPlayerEmail1);
        olPlayers2.append(liPlayerId2);
        olPlayers2.append(liPlayerEmail2);
        olMain.append(liId);
        olMain.append(liCreated);
        olMain.append(olGamePlayers);
        olGamePlayers.append(liGamePlayerId0);
        olGamePlayers.append(olPlayers1);
        olGamePlayers.append(liGamePlayerId1);
        olGamePlayers.append(olPlayers2);
        gameList.append(olMain);
    }
}
