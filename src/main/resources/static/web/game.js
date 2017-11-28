$(document).ready(function () {
    $.getJSON("http://localhost:8080/api/game_view/1", function (json) {
        data = json;
        console.log(data);
        crateGrid();
        displayPlayers();
    });
});


function crateGrid() {
    var yourGrid = document.getElementById("table-grid-your");
    var enemyGrid = document.getElementById("table-grid-enemy");
    var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    var numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var ships = data.ships;
    for (i = 0; i < alphabet.length; i++) {
        var rowU = document.createElement("tr");
        var rowE = document.createElement("tr");
        for (j = 0; j < numbers.length; j++) {
            var colU = document.createElement("td");
            var colE = document.createElement("td");
            rowU.appendChild(colU);
            rowE.appendChild(colE);
            colU.id = "U" + alphabet[i] + numbers[j];
            colE.id = "E" + alphabet[i] + numbers[j];
            colU.innerHTML = alphabet[i] + numbers[j];
            colE.innerHTML = alphabet[i] + numbers[j];
            for (k = 0; k < ships.length; k++) {
                for (l = 0; l < ships[k].location.length; l++) {
                    if (ships[k].location[l] == alphabet[i] + numbers[j]) {
                        colU.setAttribute("class", "ship-location");
                    }
                }
            }
        }
        yourGrid.appendChild(rowU);
        enemyGrid.appendChild(rowE);
    }
}

function displayPlayers() {
    var playersDiv = document.getElementById("players");
    var gameplayers = data.gameplayers;
    var h2You = document.createElement("h2");
    var h2Enemy = document.createElement("h2");
    for (i = 0; i < gameplayers.length; i++) {
        if (gameplayers[i].id == data.gpid) {
            var playerYou = gameplayers[i].player.email
        } else {
            var playerEnemy = gameplayers[i].player.email
        }
    }

    h2You.innerHTML = playerYou + "(you)";
    h2Enemy.innerHTML = "(enemy)" + playerEnemy;
    playersDiv.appendChild(h2You);
    playersDiv.appendChild(h2Enemy);

    console.log(playerYou);
    console.log(playerEnemy);
    console.log(data.gpid);
}
