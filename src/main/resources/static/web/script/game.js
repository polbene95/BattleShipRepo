//////////////////////////////////////GLOBAL VAR///////////////////////////////////
var gpID = getURL();

var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
var numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
/////////////////////////////////////API CALLS////////////////////////////////////

$("#ended-game").hide();
$("#block-div").hide();
$("#place-ship").hide();
$("#drag1").hide();
$("#drag2").hide();
$("#drag3").hide();
$("#drag4").hide();
$("#post-ship").hide();

$(document).ready(function () {

    var previous = null;
    var current = null;

    $.getJSON("/api/game_view/" + gpID, function (json) {
        data = json;
        var gameId = data.id;
        console.log(data);
        turnLogic();

        waitingForEnemy();

        if (data.ships[0] != null) {
            $("#table-grid-enemy").show();
            $("#players").show();
            $("#shoot").show();
            //            shotSalvos();

            displayPlayers();
            crateGrid();
            printShips();
            displaySalvos();
            getHits();
            waitingForOponent();
            //            showSunk();

        } else {
            crateGrid();

            $("#place-ship").show();
            $("#drag1").show();
            $("#drag2").show();
            $("#drag3").show();
            $("#drag4").show();
            $("#post-ship").show();

            $("#table-grid-enemy").hide();
            $("#players").hide();
            $(".btnHori").hide();
            $("#shoot").hide();


        }
    });
});

function getURL() {
    // Genrea un var que cambia el JSON que llega desde location.search, solo necesito el numero así que hago lo siguiente:
    // location.search nos da &gp=1
    // - .split("&")[0]: elimina el & y toma el valor sigueinte, es decir, gp=1;
    // - .split("=")[1]: elimina el = y toma el segundo valor.
    //La posicion que marco con[0] y [1], son lo que quiero tomar.
    var myGamePlayer = window.location.search.split("=")[1];
    return myGamePlayer;
}

function reloadApiGames() {
    $.getJSON("/api/game_view/" + gpID, function (json) {
        data = json;
        //        $("#block-div").hide();
        //        crateGrid();
        console.log(data);
    });
    //    console.log("reloaded api");
    turnLogic();
    displaySalvos();
}

///////////////////////////////////EXTRA FUNCTIONS////////////////////////////////

function backButton() {
    var backButton = document.getElementById("back-button");
    backButton.setAttribute("href", "/web/games.html");
}

function randomArray() {

    var randomArray = [];
    for (i = 0; i < alphabet.length; i++) {
        for (j = 0; j < numbers.length; j++) {
            var position = alphabet[i] + numbers[j];
            randomArray.push(position);
        }
    }
    return randomArray;
    console.log(randomArray);
}

///////////////////////////////////PRINT GRID AND PLAYERS/////////////////////////

function crateGrid() {
    // Crea las tablas, ademas les assigna un id ( U si es la tabla del player-view y E si es el player-enemy) en funcion de la posicion de la celda. La segunda parte assigna una clase ship-location en las celdas donde hay un barco.
    var yourGrid = document.getElementById("table-grid-your");
    var enemyGrid = document.getElementById("table-grid-enemy");
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

////////////////////////////////////PLACE SHIPS////////////////////////////////////

function printShips() {
    var ships = data.ships;
    for (i = 0; i < alphabet.length; i++) {
        for (j = 0; j < numbers.length; j++) {
            var thisPosition = alphabet[i] + numbers[j];
            for (k = 0; k < ships.length; k++) {
                for (l = 0; l < ships[k].location.length; l++) {
                    if (ships[k].location[l] == alphabet[i] + numbers[j]) {
                        $("#U" + thisPosition).addClass("ship-location");
                    }
                }
            }
        }

    }
}

function getAllPositions() {

    var randomArray = [];
    for (i = 0; i < alphabet.length; i++) {
        for (j = 0; j < numbers.length; j++) {
            var position = alphabet[i] + numbers[j];
            randomArray.push(position);
        }
    }
    //    console.log(randomArray);
    var gpID = getURL();

    //    console.log(placeShip("#drag1"));
    //    console.log(placeShip("#drag2"));
    //    console.log(placeShip("#drag3"));
    //    console.log(placeShip("#drag4"));

    var desLoc = placeShip("#drag1");
    var cruiLoc = placeShip("#drag2");
    var subLoc = placeShip("#drag3");
    var patLoc = placeShip("#drag4");

    var ships = [
        {
            type: "Destructor",
            locations: desLoc
            }, {
            type: "Cruiser",
            locations: cruiLoc
                       },
        {
            type: "Submarine",
            locations: subLoc
                       },
        {
            type: "Patrol Boat",
            locations: patLoc
                       }];

    var allLoc = [];

    for (let i = 0; i < desLoc.length; i++) {
        var eachLoc = desLoc[i];
        allLoc.push(eachLoc);
    }
    for (let i = 0; i < cruiLoc.length; i++) {
        var eachLoc = cruiLoc[i];
        allLoc.push(eachLoc);
    }
    for (let i = 0; i < subLoc.length; i++) {
        var eachLoc = subLoc[i];
        allLoc.push(eachLoc);
    }
    for (let i = 0; i < patLoc.length; i++) {
        var eachLoc = patLoc[i];
        allLoc.push(eachLoc);
    }

    //    console.log(allLoc);

    //////////////////////RESTRICTIONS//////////////////////////
    var valuesSoFar = [];
    for (let i = 0; i < allLoc.length; ++i) {
        //////////////////////OVERPLACED////////////////////////////
        var value = allLoc[i];
        //        console.log(value);
        if (valuesSoFar.indexOf(value) !== -1) {
            if (value === "lNaN") {

                console.log("Ship not placed");
                var alert1 = "MUST PLACE ALL YOUR SHIPS";

            } else {

                console.log("ERROR OVERPLACED AT " + value);
                var alert2 = "ERROR OVERPLACED AT " + value + ", PLASE PLACE IT ON DIFERENT POSITIONS";
            }
        }
        ////////////////////////OUTSIDE TEH GRID////////////////////
        if (randomArray.includes(value) == false) {
            console.log("Not In Grid");
            var alert3 = "PLACING SHIPS OUTSIDE THE GRID"
        }

        valuesSoFar.push(value);
    }
    if (alert1 != undefined) {
        alert(alert1);
        window.location.reload();
    } else if (alert2 != undefined) {
        alert(alert2);
        window.location.reload();
    } else if (alert3 != undefined) {
        alert(alert3);
        window.location.reload();
    } else {
        ////////////////////////POST////////////////////////
        $.post({
                url: "/api/games/players/" + gpID + "/ships",
                data: JSON.stringify(ships),
                dataType: "text",
                contentType: "application/json"
            })
            .done(function (response) {
                console.log(ships);
                console.log(response)
                //                alert("Ships added: " + ships);
                $("#table-grid-enemy").show();
                $("#players").show();
                $("#place-ship").hide();
                $("#drag1").hide();
                $("#drag2").hide();
                $("#drag3").hide();
                $("#drag4").hide();
                window.location.reload();
                waitingForOponent();

            })
            .fail(function () {
                console.log("error something is failing");
            })

    }
}

function waitingForOponent() {

    if (data.gameplayers.length != 2) {
        $(".table-div").hide();
        $("#ended-game p").text("While we are waiting for a start to let the battle out, let's keep at the harbor, let our soldiers prepare everything, once the battleship is ready for the fight, we will let you know it to begin").css({
            "font-size": "25px",
            "opacity": "0.8",
            "z-index": "1"
        });
        var button = document.createElement("button");
        $(button).addClass("btn to-hall").text("Back to Hall");
        $(button).on("click", function () {
            window.location.href = "/web/games.html";
        })
        $("#ended-game").append(button);
        $("#ended-game").show();
    } else {
        $("#ended-game").hide();
    }
}

function placeShip(ship) {

    var getParentsIdCrui = $(ship).parent().attr("id");

    var rowLocShip = getParentsIdCrui.charAt(1);
    var ShipLoc = parseInt(getParentsIdCrui.charAt(2));
    var verPos = alphabet[alphabet.indexOf(rowLocShip)];

    var ShipLocations = [];
    var ShipLocations2 = [];
    /////////////////DESTRUCTOR HOR/////////////
    if ($(ship).width() == 245) {
        for (var i = 0; i < 5; i++) {
            var ShipLocat = (ShipLoc + i).toString();

            ShipLocations.push(rowLocShip + ShipLocat);
            ShipLocations2.push("U" + rowLocShip + ShipLocat);
            //            $("#U" + rowLocShip + ShipLocat).addClass("ship-location");

        }
        ////////////////CRUISER HOR/////////////////
    } else if ($(ship).width() == 195) {
        for (var i = 0; i < 4; i++) {
            var ShipLocat = (ShipLoc + i).toString();

            ShipLocations.push(rowLocShip + ShipLocat);
            ShipLocations2.push("U" + rowLocShip + ShipLocat);
            //            $("#U" + rowLocShip + ShipLocat).addClass("ship-location");
        }
        //////////////SUBMARINE AND PETROL BOAT HOR///////////////
    } else if ($(ship).width() == 145) {
        for (var i = 0; i < 3; i++) {
            var ShipLocat = (ShipLoc + i).toString();

            ShipLocations.push(rowLocShip + ShipLocat);
            ShipLocations2.push("U" + rowLocShip + ShipLocat);
            //            $("#U" + rowLocShip + ShipLocat).addClass("ship-location");
        }
        ////////////////////////DESTRUCTOR VER///////////////////
    } else if ($(ship).height() == 245) {
        for (var i = 0; i < 5; i++) {

            var verPos = alphabet[alphabet.indexOf(rowLocShip) + i];
            var ShipLocat = verPos.toString();

            ShipLocations.push(verPos + ShipLoc);
            ShipLocations2.push("U" + verPos + ShipLoc);
            //            $("#U" + verPos + ShipLoc).addClass("ship-location");
        }
        ////////////////////////CRUISER VER//////////////////////
    } else if ($(ship).height() == 195) {
        for (var i = 0; i < 4; i++) {

            var verPos = alphabet[alphabet.indexOf(rowLocShip) + i];
            var ShipLocat = (verPos).toString();

            ShipLocations.push(verPos + ShipLoc);
            ShipLocations2.push("U" + verPos + ShipLoc);
            //            $("#U" + verPos + ShipLoc).addClass("ship-location");
        }
        //////////////////SUBMARINE AND PETROL BOAT VER///////////////
    } else if ($(ship).height() == 145) {
        for (var i = 0; i < 3; i++) {

            var verPos = alphabet[alphabet.indexOf(rowLocShip) + i];
            var ShipLocat = (verPos).toString();

            ShipLocations.push(verPos + ShipLoc);
            ShipLocations2.push("U" + verPos + ShipLoc);
            //            $("#U" + verPos + ShipLoc).addClass("ship-location");
        }
    }
    return ShipLocations;
}

//ROTATE FUNCTIONS

function rotateToHoriz(ship) {

    if (ship == "#drag1") {
        $("#drag1").width(245);
        $("#drag1 .icon-ship").css({
            "width": "20%",
            "height": "100%"
        });
    }
    if (ship == "#drag2") {

        $("#drag2").width(195);
        $("#drag2 .icon-ship").css({
            "width": "20%",
            "height": "100%"
        });

    }
    if (ship == "#drag3") {

        $("#drag3").width(145);
        $("#drag3 .icon-ship").css({
            "width": "20%",
            "height": "100%"
        });
    }
    if (ship == "#drag4") {
        $("#drag4").width(145);
        $("#drag4 .icon-ship").css({
            "width": "20%",
            "height": "100%"
        });

    }
    $(ship).height(45);


    $(".btnVert").show();
    $(".btnHori").hide();
}

function rotateToVert(ship) {

    if (ship == "#drag1") {
        $("#drag1").height(245);
        $("#drag1 .icon-ship").css({
            "width": "100%",
            "height": "20%"
        });
    }
    if (ship == "#drag2") {

        $("#drag2").height(195);
        $("#drag3 .icon-ship").css({
            "width": "100%",
            "height": "20%"
        });

    }
    if (ship == "#drag3") {

        $("#drag3").height(145);
        $("#drag3 .icon-ship").css({
            "width": "100%",
            "height": "20%"
        });

    }
    if (ship == "#drag4") {
        $("#drag4").height(145);
        $("#drag4 .icon-ship").css({
            "width": "100%",
            "height": "20%"
        });

    }
    $(ship).width(45);

    $(".btnVert").hide();
    $(".btnHori").show();
}

//DRAG AND DROP FUNCTIONS

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

////////////////////////////////////DISPLAY SALVOS////////////////////////////////

function displaySalvos() {
    var salvos = data.salvos;
    console.log(salvos);
    for (i = 0; i < salvos.length; i++) {
        for (j = 0; j < salvos[i].length; j++) {
            var slavoLocation = salvos[i][j].location;
            for (k = 0; k < slavoLocation.length; k++) {
                if (salvos[i][j].player == data.gpid) {
                    var myShots = slavoLocation[k];
                    $("#E" + myShots).addClass("shotted");

                }
                if (salvos[i][j].player !== data.gpid) {
                    var enemyShot = slavoLocation[k];
                    if ($("#U" + enemyShot).hasClass("ship-location")) {

                        $("#U" + enemyShot).addClass("succ-Shot");
                    }
                    if ($("#U" + enemyShot).hasClass("ship-location") == false) {
                        $("#U" + enemyShot).addClass("fail-Shot")

                    }

                }

            }
        }
    }
}

function shotSalvos() {

    var turn = displayTurn();

    for (i = 0; i < data.gameplayers.length; i++) {
        if (data.gameplayers[i].id == data.gpid) {
            var playerYou = data.gameplayers[i].player.email
        } else {
            var playerEnemy = data.gameplayers[i].player.email
        }
    }

    var yourShots = [];
    $(document).on("click", "#table-grid-enemy td", function () {

        if ($(this).hasClass("selected-cell") == false) {

            var select = $(this).attr('id');
            $(this).addClass("selected-cell");
            var char1 = select.charAt(1);
            var char2 = select.charAt(2);
            var toPush = char1 + char2;
            console.log("jolala", toPush);
            yourShots.push(toPush);
        } else {
            $(this).removeClass("selected-cell");
            var select = $(this).attr('id');
            var char1 = select.charAt(1);
            var char2 = select.charAt(2);
            var toPush = char1 + char2;
            yourShots.splice(toPush, 1);
        }
        console.log(yourShots);

    });


    $("#shoot").on("click", function () {

        if (yourShots.length > 4) {

            alert("ERROR JUST DO 4 SHOTS");
            window.location.reload();

        } else {
            var salvos = {
                turn: turn,
                locations: yourShots,

            }
            //                console.log(salvos)
            $.post({
                    url: "/api/games/players/" + gpID + "/salvos",
                    data: JSON.stringify(salvos),
                    dataType: "text",
                    contentType: "application/json"
                })
                .done(function (response) {

                    window.location.reload();
                })
                .fail(function () {

                });
        }
        //        }
    })
}



///////////////////////////////////TURN COUNTER//////////////////////////////////

function displayTurn() {
    var salvos = data.salvos;
    var pushTurn = [];
    for (i = 0; i < salvos.length; i++) {
        for (j = 0; j < salvos[i].length; j++) {

            var yourSalvos = salvos[i][j].player;

            if (yourSalvos == gpID) {

                var turn;

                if (turn !== undefined) {
                    turn = salvos[i][j].turn;
                } else {
                    turn = 1;
                }

                parseInt(turn);
                pushTurn.push(turn);

            }
            pushTurn.sort();
            var lastTurn = Math.max.apply(null, pushTurn);
        }
    }

    return lastTurn + 1;
}

////////////////////////////////SUCCESFUL HIT/////////////////////////////////////

function getHits() {

    var hits = data.hits;

    for (var i = 0; i < hits.length; i++) {
        var everyRound = hits[i];

        if (everyRound != null) {
            for (var j = 0; j < everyRound.length; j++) {
                var succHit = everyRound[j];
                $("#E" + succHit).addClass("succ-shot");
                //                $("#E" + succHit).removeClass("shotted");

            }
        }
    }
}

function showSunk() {
    var sunkNumHost = [];
    var sunkNumEnem = [];
    var history = data.history;
    for (var i = 0; i < history.length; i++) {
        var gamePlayerId = history[i].gamePlayerId;
        var shipStatus = history[i].shipStatus;
        for (var j = 0; j < shipStatus.length; j++) {
            var sunkShip = shipStatus[j].sunk;
            var typeShip = shipStatus[j].type;
            if (sunkShip == true) {

                if (gamePlayerId == gpID) {
                    sunkNumHost.push(typeShip);
                }
                if (gamePlayerId != gpID) {
                    sunkNumEnem.push(typeShip);
                }
            }
        }
    }

    //////////////////////////////////GAME OVER////////////////////////////
    if (data.gameplayers != null) {
        if (sunkNumHost.length == 4 || sunkNumEnem.length == 4) {

//            $(".table-div").css({
//                'z-index': '-1'
//            })
//            $(".table-div").css({
//                'opacity': '0.3'
//            })
            $("#ended-game").show();
            $(".table-div").hide();
            if (sunkNumHost.length == 4) {

                $("#ended-game p").text("You Lose").css({
                    "font-size": "170px",
                    "opacity": "1",
                    "z-index": "1"
                });
            }
            if (sunkNumEnem.length == 4) {

                $("#ended-game p").text("You Win").css({
                    "font-size": "200px",
                    "opacity": "1",
                    "z-index": "1"
                });
            }
        }
    }
}


////////////////////////////////////LOGIC////////////////////////////////////

///////////////TURN LOGIC/////////////

function turnLogic() {

    var gamePlayers = data.gameplayers;
    var salvos = data.salvos;

    for (let i = 0; i < gamePlayers.length; i++) {

        var gamePlayerId = gamePlayers[i].id;

        if (gamePlayerId == gpID) {
            var playerHostId = gamePlayers[i].player.id;
            var gpHostId = gamePlayers[i].id;
        } else {
            var playerEnemyId = gamePlayers[i].player.id;
            var gpEnemyId = gamePlayers[i].id;
        }
    }


    //Si el valor es 0 lo creo el enemigo, si es 1 lo creo el mismo host
    var howCreatedTheGame;
    if (gpHostId > gpEnemyId || gpEnemyId == null) {
        whoCreatedTheGame = 1;

    }
    if (gpHostId < gpEnemyId) {
        whoCreatedTheGame = 0;

    }
    var userTurns = [];
    var enemyTurns = [];
    for (let i = 0; i < salvos.length; i++) {
        for (var j = 0; j < salvos[i].length; j++) {

            var playerId = salvos[i][j].player;

            if (playerId == gpHostId) {

                var userTurn = salvos[i][j].turn;
                userTurns.push(userTurn);
            }
            if (playerId == gpEnemyId) {

                var enemyTurn = salvos[i][j].turn;
                enemyTurns.push(enemyTurn);
            }
        }
    }

    var waitingTurn;
    if (enemyTurns.length < userTurns.length) {
        console.log("hola1");

        waitingTurn = 1;
    } else if (enemyTurns.length > userTurns.length) {
        console.log("hola2");

        waitingTurn = 0;
    } else if (enemyTurns.length === userTurns.length && whoCreatedTheGame == 0) {
        console.log("hola3");

        waitingTurn = 0;
    } else if (enemyTurns.length === userTurns.length && whoCreatedTheGame == 1) {
        console.log("hola4");

        waitingTurn = 1;
    }


    if (waitingTurn === 1) {
        console.log("hola5");
        $("#shoot").removeClass("player-turn");
        $('#table-grid-your').removeClass("player-turn");
        $('#table-grid-enemy').removeClass("player-wait");
        $('#table-grid-your').addClass("player-wait");
        $('#table-grid-enemy').addClass("player-turn");
        showSunk();
        setTimeout(reloadApiGames, 1000);
    } 
    if (waitingTurn === 0){
//        $("#block-div").hide();
        $("#shoot").addClass("player-turn");
        $('#table-grid-enemy').removeClass("player-turn");
        $('#table-grid-your').removeClass("player-wait");
        $('#table-grid-enemy').addClass("player-wait");
        $('#table-grid-your').addClass("player-turn");
        console.log("hola6");
        setTimeout(showSunk, 10);
        shotSalvos();


    }
}

function waitingForEnemy() {

    var gameplayers = data.gameplayers;
    if (gameplayers.length < 2) {

        $("#shoot").hide();
        $('#table-grid-enemy tr td').addClass("player-turn");
        $('#table-grid-enemy').on("click", function () {
            //            $("#block-div").show();
            return false;
        });
    }
}


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

////////////////////////////////////////////////////////////////////////

//
//function placeShip(ship) {
//
//    var getParentsIdCrui = $(ship).parent().attr("id");
//
//    var rowLocShip = getParentsIdCrui.charAt(1);
//    //    console.log(alphabet[alphabet.indexOf(rowLocShip) - i]);
//    var ShipLoc = parseInt(getParentsIdCrui.charAt(2));
//    var verPos = alphabet[alphabet.indexOf(rowLocShip)]
//    var ShipLocations = [];
//    var ShipLocations2 = [];
//
//    if ($(ship).width() == 245 || $(ship).height() == 245) {
//        for (var i = 0; i < 5; i++) {
//            var ShipLocat = (ShipLoc + i).toString();
//            ShipLocations.push(rowLocShip + ShipLocat);
//            ShipLocations2.push("U" + rowLocShip + ShipLocat);
//
//        }
//    } else if ($(ship).width() == 195 || $(ship).height() == 195) {
//        for (var i = 0; i < 4; i++) {
//            var ShipLocat = (ShipLoc + i).toString();
//            ShipLocations.push(rowLocShip + ShipLocat);
//            ShipLocations2.push("U" + rowLocShip + ShipLocat);
//        }
//    } else if ($(ship).width() == 145 || $(ship).height() == 145) {
//        for (var i = 0; i < 3; i++) {
//            var ShipLocat = (ShipLoc + i).toString();
//            ShipLocations.push(rowLocShip + ShipLocat);
//            ShipLocations2.push("U" + rowLocShip + ShipLocat);
//        }
//    }
//
//
//    console.log(ShipLocations);
//    console.log(ShipLocations2);
//
//
//}
//
//function rotateToHoriz(ship) {
//
//    if (ship == "#drag1") {
//        $("#drag1").height(245);
//
//    }
//    if (ship == "#drag2") {
//
//        $("#drag2").height(195);
//    }
//    if (ship == "#drag3") {
//
//        $("#drag3").height(145);
//    }
//    if (ship == "#drag4") {
//        $("#drag4").height(145);
//
//    }
//    $(ship).width(45);
//
//}
//
//function rotateToVert(ship) {
//
//    if (ship == "#drag1") {
//        $("#drag1").height(245);
//
//    }
//    if (ship == "#drag2") {
//
//        $("#drag2").height(195);
//    }
//    if (ship == "#drag3") {
//
//        $("#drag3").height(145);
//    }
//    if (ship == "#drag4") {
//        $("#drag4").height(145);
//
//    }
//    $(ship).width(45);
//}
//
//function placeShip2(ship) {
//
//    //    if (ship == "#drag1") {
//    //        $("#drag1").height(245);
//    //
//    //    }
//    //    if (ship == "#drag2") {
//    //
//    //        $("#drag2").height(195);
//    //    }
//    //    if (ship == "#drag3") {
//    //
//    //        $("#drag3").height(145);
//    //    }
//    //    if (ship == "#drag4") {
//    //        $("#drag4").height(145);
//    //
//    //    }
//    //    $(ship).width(45);
//
//    var getParentsIdCrui = $(ship).parent().attr("id");
//
//    var rowLocShip = getParentsIdCrui.charAt(1);
//    var ShipLoc = parseInt(getParentsIdCrui.charAt(2));
//
//    var ShipLocations = [];
//    var ShipLocations2 = [];
//
//    if ($(ship).height() == 245) {
//        for (var i = 0; i < 5; i++) {
//
//            var verPos = alphabet[alphabet.indexOf(rowLocShip) + i];
//            var ShipLocat = verPos.toString();
//
//            ShipLocations.push(verPos + ShipLoc);
//            ShipLocations2.push("U" + verPos + ShipLoc);
//        }
//    } else if ($(ship).height() == 195) {
//        for (var i = 0; i < 4; i++) {
//
//            var verPos = alphabet[alphabet.indexOf(rowLocShip) + i];
//            var ShipLocat = (verPos).toString();
//
//            ShipLocations.push(verPos + ShipLoc);
//            ShipLocations2.push("U" + verPos + ShipLoc);
//        }
//    } else if ($(ship).height() == 145) {
//        for (var i = 0; i < 3; i++) {
//
//            var verPos = alphabet[alphabet.indexOf(rowLocShip) + i];
//            var ShipLocat = (verPos).toString();
//
//            ShipLocations.push(verPos + ShipLoc);
//            ShipLocations2.push("U" + verPos + ShipLoc);
//        }
//    }
//
//
//    console.log(ShipLocations);
//    console.log(ShipLocations2);
//
//}
//
//function allowDrop(ev) {
//    ev.preventDefault();
//}
//
//function drag(ev) {
//    ev.dataTransfer.setData("text", ev.target.id);
//}
//
//function drop(ev) {
//    ev.preventDefault();
//    var data = ev.dataTransfer.getData("text");
//    ev.target.appendChild(document.getElementById(data));
//}
