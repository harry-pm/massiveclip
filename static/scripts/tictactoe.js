const createBoard = () => {
    HTMLToInject = ""
    for(j = 0; j < 9; j+=3){
        rowHTML = []
        for(i = j; i < (j + 3); i++){
            rowHTML.push(`<div class="gameSquare" id="square${i}"></div>`)
        }
        HTMLToInject += `<div class="row">${rowHTML.join("")}</div>`
    }
    console.log(HTMLToInject);
    document.getElementById('gameBoard').innerHTML = (HTMLToInject)
}

let playerToMove = "Player1"

const updater = {
    socket: null,
    displayMove: (id, nought_or_cross)=> {
        document.getElementById(id).innerHTML = nought_or_cross; // Inserts either an O or X, properly formatted to fill the box
    },
    start: () => {
        const url = "ws://" + location.host + "/noughts_and_crosses_socket"; // builds a url for creating the websocket below
        updater.socket = new WebSocket(url);
        updater.socket.onmessage = (event) => {
            infoAsJSON = JSON.parse(event.data);
            console.log(infoAsJSON.player)

            if (infoAsJSON.player === "Player1" && playerToMove === "Player1"){
                symbol = "X";
                playerToMove = "Player2";
                updater.displayMove(infoAsJSON.message_info, symbol)
            }
            else if (infoAsJSON.player === "Player2" && playerToMove === "Player2"){
                symbol = "O";
                playerToMove = "Player1";
                updater.displayMove(infoAsJSON.message_info, symbol)
            }
            // updater.displayMove(infoAsJSON.message_info, symbol)
        }
    }
}

const updateMove = (elementIdToBeUpdated) => {
    updater.socket.send(elementIdToBeUpdated); // hard coded int for now?
}

$(document).ready(() => {
    createBoard()
    $(".gameSquare").on("click", () => {
        updateMove(event.target.id);
        console.log("Player to move: " + playerToMove);
    })

    updater.start()
});