$(document).ready(function () {
    $.getJSON("http://localhost:8080/api/game_view/1", function (json) {
        data = json;
        console.log(data);
    });
});
function gameInfo () {
    var gameInfo = document.getElementById("game-info");
    for (i=0; i < data.length; i++) {
        
    }
}