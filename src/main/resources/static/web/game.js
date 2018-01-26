//$("#my-ships").hide();
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
var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

function crateGrid() {
    var yourGrid = document.getElementById("table-grid-your");
    var enemyGrid = document.getElementById("table-grid-enemy");
    var ships = data.ships;
    for (i = 0; i < alphabet.length; i++) {
        var rowU = document.createElement("tr");
        var rowE = document.createElement("tr");
        for (j = 0; j < numbers.length; j++) {
            var parU = document.createElement("p");
            var parE = document.createElement("p");
            parU.setAttribute("class", "pInBack");
            parE.setAttribute("class", "pInBack");
            var colU = document.createElement("td");
            var colE = document.createElement("td");

            rowU.appendChild(colU);
            rowE.appendChild(colE);
            colU.append(parU);
            colE.append(parE);
            colU.id = "U" + alphabet[i] + numbers[j];
            colE.id = "E" + alphabet[i] + numbers[j];
            parU.innerHTML = alphabet[i] + numbers[j];
            parE.innerHTML = alphabet[i] + numbers[j];
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

function placeShip(ship) {

    if (ship == "#drag1") {

        $("#drag1").width(245);
    }
    if (ship == "#drag2") {

        $("#drag2").width(195);
    }
    if (ship == "#drag3") {

        $("#drag3").width(145);
    }
    if (ship == "#drag4") {
        $("#drag4").width(195);

    }
    $(ship).height(45);

    var getParentsIdCrui = $(ship).parent().attr("id");

    var rowLocShip = getParentsIdCrui.charAt(1);
    //    console.log(alphabet[alphabet.indexOf(rowLocShip) - i]);
    var ShipLoc = parseInt(getParentsIdCrui.charAt(2));
    var verPos = alphabet[alphabet.indexOf(rowLocShip)]
    var ShipLocations = [];
    var ShipLocations2 = [];

    if ($(ship).width() == 245) {
        for (var i = 0; i < 5; i++) {
            var ShipLocat = (ShipLoc + i).toString();
            ShipLocations.push(rowLocShip + ShipLocat);
            ShipLocations2.push("U" + rowLocShip + ShipLocat);

        }
    } else if ($(ship).width() == 195) {
        for (var i = 0; i < 4; i++) {
            var ShipLocat = (ShipLoc + i).toString();
            ShipLocations.push(rowLocShip + ShipLocat);
            ShipLocations2.push("U" + rowLocShip + ShipLocat);
        }
    } else if ($(ship).width() == 145) {
        for (var i = 0; i < 3; i++) {
            var ShipLocat = (ShipLoc + i).toString();
            ShipLocations.push(rowLocShip + ShipLocat);
            ShipLocations2.push("U" + rowLocShip + ShipLocat);
        }
    }


    console.log(ShipLocations);
    console.log(ShipLocations2);


}

function placeShip2(ship) {

    if (ship == "#drag1") {
        $("#drag1").height(245);

    }
    if (ship == "#drag2") {

        $("#drag2").height(195);
    }
    if (ship == "#drag3") {

        $("#drag3").height(145);
    }
    if (ship == "#drag4") {
        $("#drag4").height(145);

    }
    $(ship).width(45);

    var getParentsIdCrui = $(ship).parent().attr("id");

    var rowLocShip = getParentsIdCrui.charAt(1);
    var ShipLoc = parseInt(getParentsIdCrui.charAt(2));

    var ShipLocations = [];
    var ShipLocations2 = [];

    if ($(ship).height() == 245) {
        for (var i = 0; i < 5; i++) {

            var verPos = alphabet[alphabet.indexOf(rowLocShip) + i];
            var ShipLocat = verPos.toString();

            ShipLocations.push(verPos + ShipLoc);
            ShipLocations2.push("U" + verPos + ShipLoc);
        }
    } else if ($(ship).height() == 195) {
        for (var i = 0; i < 4; i++) {

            var verPos = alphabet[alphabet.indexOf(rowLocShip) + i];
            var ShipLocat = (verPos).toString();

            ShipLocations.push(verPos + ShipLoc);
            ShipLocations2.push("U" + verPos + ShipLoc);
        }
    } else if ($(ship).height() == 145) {
        for (var i = 0; i < 3; i++) {

            var verPos = alphabet[alphabet.indexOf(rowLocShip) + i];
            var ShipLocat = (verPos).toString();

            ShipLocations.push(verPos + ShipLoc);
            ShipLocations2.push("U" + verPos + ShipLoc);
        }
    }


    console.log(ShipLocations);
    console.log(ShipLocations2);

}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}









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
//function placeDest() {
//    
//}
//
//function placeCrui() {
//
//    var cruiRadio = document.getElementById("crui-radio");
//    console.log("crui is checked");
//
//}
//
//function placeSub() {
//
//    var subRadio = document.getElementById("sub-radio");
//    console.log("submarine is checked");
//
//}
//
//function placeBoat() {
//
//    var boatRadio = document.getElementById("boat-radio");
//    console.log("boat is checked");
//}









//
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
