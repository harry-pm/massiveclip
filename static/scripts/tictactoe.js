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

const updater = {
    socket: null,
    displayMove: (id, nought_or_cross)=> {
        document.getElementById(id).innerHTML = nought_or_cross; // Inserts either an O or X, properly formatted to fill the box
    },
    start: () => {
        const url = "ws://" + location.host + "/noughts_and_crosses_socket"; // builds a url for creating the websocket below
        updater.socket = new WebSocket(url);
        updater.socket.onmessage = (event) => {
            if (event.data.player === "Player1"){
                symbol = "X"
            }
            else if (event.data.player === "Player2"){
                symbol = "O"
            }
            else{
                symbol = "ERR"
            }
            updater.displayMove((event.data.message_info, symbol))
        }
    }
}

const updateMove = (elementIdToBeUpdated) => {
    updater.socket.send(elementIdToBeUpdated); // hard coded int for now?
}

$(document).ready(() => {
    createBoard()
    $(".gameSquare").on("click", () => {
        console.log("click detected!")
        updateMove(event.target.id);
    })

    updater.start()
});