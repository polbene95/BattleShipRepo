$(document).ready(function () {
    $.getJSON("http://localhost:8080/api/game_view/1", function (json) {
        data = json;
        console.log(data);
        crateGrid();
    });
});


function crateGrid() {
    var table = document.getElementById("table-grid");
    var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    var numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var ships = data.ships;
    for (i = 0; i < alphabet.length; i++) {
        var row = document.createElement("tr");
        for (j = 0; j < numbers.length; j++) {
            var col = document.createElement("td");
            row.appendChild(col);
            col.id = "U" + alphabet[i] + numbers[j];
            col.innerHTML = alphabet[i] + numbers[j];
            for (k = 0; k < ships.length; k++) {
                for (l = 0; l < ships[k].location.length; l++) {
                    if (ships[k].location[l] == alphabet[i] + numbers[j]) {
                        if (ships[k].location.length == 1) {
                            col.setAttribute("class", "boat-location");
                        }
                        if (ships[k].location.length == 2) {
                            col.setAttribute("class", "cruiser-location");
                        }
                        if (ships[k].location.length == 3) {
                            col.setAttribute("class", "destructor-location");
                        }
                    }
                }
            }
        }
        table.appendChild(row);
    }
}
