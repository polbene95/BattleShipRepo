//$("#my-ships").hide();
placeShips();
$(document).ready(function () {
    var gpID = getURL();
    $.getJSON("http://localhost:8080/api/game_view/" + gpID, function (json) {
        data = json;
        console.log(data);
        crateGrid();
        displayPlayers();
        displaySalvos();
        //        placeShips();
        //        randomShip();
    });
});
// Genrea un var que cambia el JSON que llega desde location.search, solo necesito el numero así que hago lo siguiente:
// location.search nos da &gp=1
// - .split("&")[0]: elimina el & y toma el valor sigueinte, es decir, gp=1;
// - .split("=")[1]: elimina el = y toma el segundo valor.
//La posicion que marco con[0] y [1], son lo que quiero tomar.
function getURL() {
    var myGamePlayer = window.location.search.split("=")[1];
    return myGamePlayer;
}

// Crea las tablas, ademas les assigna un id ( U si es la tabla del player-view y E si es el player-enemy) en funcion de la posicion de //la celda. La segunda parte assigna una clase ship-location en las celdas donde hay un barco.

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
                        $("#my-ships").hide();
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
}

function displaySalvos() {
    var salvos = data.salvos;
    for (i = 0; i < salvos.length; i++) {
        for (j = 0; j < salvos[i].length; j++) {
            var slavoLocation = salvos[i][j].location;
            for (k = 0; k < slavoLocation.length; k++) {
                if (salvos[i][j].player == data.gpid) {
                    var myShots = slavoLocation[k];
                    $("#E" + myShots).addClass("shotted");
                    console.log(myShots);
                }
                if (salvos[i][j].player !== data.gpid) {
                    var enemyShot = slavoLocation[k];
                    if ($("#U" + enemyShot).hasClass("ship-location")) {
                        $("#U" + enemyShot).addClass("succ-Shot");
                    }
                    if (!$("#U" + enemyShot).hasClass("ship-location")) {
                        $("#U" + enemyShot).addClass("fail-Shot")
                    }

                }
            }
        }
        console.log(slavoLocation);
    }
}

function backButton() {
    var backButton = document.getElementById("back-button");
    backButton.setAttribute("href", "/web/games.html");
}

function placeShips() {
    
    var destRadio = document.getElementById("dest-radio");
    var cruiRadio = document.getElementById("crui-radio");
    var subRadio = document.getElementById("sub-radio");
    var boatRadio = document.getElementById("boat-radio");
    
    if (destRadio.checked) {
        
        console.log("dest is checked");
    }
//    if () {}
//    if () {}
//    if () {}
//    
    
    
  }
function placeDest () {
    
    var destRadio = document.getElementById("dest-radio");
    console.log("dest is checked");
}

function placeCrui () {
    
    var cruiRadio = document.getElementById("crui-radio");
    console.log("crui is checked");
    
}

function placeSub () {
    
    var subRadio = document.getElementById("sub-radio");
    console.log("submarine is checked");
    
}

function placeBoat () {
    
    var boatRadio = document.getElementById("boat-radio");
    console.log("boat is checked");
}















































//
//function randomArry() {
//
//    var randomArray = [];
//
//    var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
//    var numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
//
//    for (i = 0; i < alphabet.length; i++) {
//        for (j = 0; j < numbers.length; j++) {
//            var position = alphabet[i] + numbers[j];
//            randomArray.push(position);
//        }
//    }
//
//    return randomArray;
//}
//
//function randomShip() {
//
//    var gpID = getURL();
//    var randomArray = randomArry();
//
//    var destArray = [];
//    var cruiArray = [];
//    var boatArray = [];
//
//    var data = {
//        "ship": [{
//            "type": "destructor",
//            "location": destArray
//                                        }, {
//            "type": "cruiser",
//            "location": cruiArray
//                                        }, {
//            "type": "boat",
//            "location": boatArray
//                                        }]
//    };
//
//    if ($("td").hasClass("ship-location")) {
//        $("td").removeClass("ship-location")
//    }
//
//    for (k = 0; k < randomArray.length; k++) {
//
//        var randomK1 = Math.floor(Math.random() * randomArray.length);
//        var randomK2 = Math.floor(Math.random() * randomArray.length);
//        var randomK3 = Math.floor(Math.random() * randomArray.length);
//    }
//
//    var destLoc1 = randomArray[randomK1];
//    var destLoc2 = randomArray[randomK1 + 1];
//    var destLoc3 = randomArray[randomK1 + 2];
//
//    var cruiLoc1 = randomArray[randomK2];
//    var cruiLoc2 = randomArray[randomK2 + 1];
//
//    var boatLoc1 = randomArray[randomK3];
//
//    if (destLoc1 == undefined ||
//        destLoc2 == undefined ||
//        destLoc3 == undefined ||
//        cruiLoc1 == undefined ||
//        cruiLoc2 == undefined ||
//        boatLoc1 == undefined) {
//
//        // No se porque se me generan a vecez elementos undefined, pero lo que hago con este condicional es saltarme esta piedra, si hay algun elemento undefined simplemente vuelve a llamar la funcion.
//        console.log("undefined element")
//        randomShip();
//
//    } else {
//
//        var dest1Chart = destLoc1.charAt(0);
//        var dest2Chart = destLoc2.charAt(0);
//        var dest3Chart = destLoc3.charAt(0);
//        var crui1Chart = cruiLoc1.charAt(0);
//        var crui2Chart = cruiLoc2.charAt(0);
//
//        if (dest1Chart == dest2Chart &&
//            dest2Chart == dest3Chart &&
//            crui1Chart == crui2Chart) {
//
//            if (destLoc1 != cruiLoc1 &&
//                destLoc1 != cruiLoc2 &&
//                destLoc1 != boatLoc1 &&
//                destLoc2 != cruiLoc1 &&
//                destLoc2 != cruiLoc2 &&
//                destLoc2 != boatLoc1 &&
//                destLoc3 != cruiLoc1 &&
//                destLoc3 != cruiLoc2 &&
//                destLoc3 != boatLoc1 &&
//                cruiLoc1 != boatLoc1 &&
//                cruiLoc2 != boatLoc1) {
//
//                destArray.push(destLoc1);
//                destArray.push(destLoc2);
//                destArray.push(destLoc3);
//                cruiArray.push(cruiLoc1);
//                cruiArray.push(cruiLoc2);
//                boatArray.push(boatLoc1);
//
//                $("#U" + destLoc1).addClass("ship-location");
//                $("#U" + destLoc2).addClass("ship-location");
//                $("#U" + destLoc3).addClass("ship-location");
//                $("#U" + cruiLoc1).addClass("ship-location");
//                $("#U" + cruiLoc2).addClass("ship-location");
//                $("#U" + boatLoc1).addClass("ship-location");
//
//                console.log(destArray);
//                console.log(cruiArray);
//                console.log(boatArray);
//
//                return data;
//                
//            } else {
//                //Si dos barcos estan en la misma celda vuelve a llamar a la funcion. Esto lo hara hasta que encuentre que ningun barco esta en la misma celda
//                randomShip();
//                console.log("overplaceed");
//            }
//        } else {
//            // Si hay un barco que empieza en A8 y termina en B1 (supongamos que es un barco de length = 3) vuelve a llamar la funcion, busco que los barcos siempre esten en una misma row.
//            randomShip();
//            console.log("diferent row");
//        };
//    }
//}
//
//function placeShipsRandomly() {
//    var data = randomShip();
//    var gpID = getURL();
//    console.log(data);
//    console.log(JSON.stringify(data));
//    $.post("/api/games/players/" + gpID + "/ships", {
//
//        ship: JSON.stringify(data)
//        
//    }).done(function () {
//        console.log("ships are posted")
//    }).fail()
//}
//
//function placeShipManually () {
//    
//}
