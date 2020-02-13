const createBoard = () => {
    HTMLToInject = ""
    for(j = 0; j < 9; j+=3){
        rowHTML = []
        for(i = j; i < (j + 3); i++){
            rowHTML.push(`<div class="gameSquare" id="square${i}"></div>`)
        }
        HTMLToInject += `<div class="row">${rowHTML.join("")}</div>`
    }
    document.getElementById('gameBoard').innerHTML = (HTMLToInject)
}

let playerToMove = "Player1"


const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // vertical wins
    [0, 3, 6], [1, 4, 7], [2, 5, 8], //horizontal wins
    [0, 4, 8], [2, 4, 6] // diagonal wins
]

const checkIfWin = (winConditionArray) => {
    for (conditionArray of winConditionArray){
        // Normally bad practice to nest loops, but with winConditionArrays limited to length 3, time complexity shouldn't be too important.
        let scoreCount = 0; // X will be +1, O will be -1 : if 3 in a row sum to either 3 or -3, we have a winner.
        for(number of conditionArray){
            boardPiece = document.getElementById("square" + number);
            if(boardPiece.innerHTML === "X"){
                scoreCount ++;
            }
            else if(boardPiece.innerHTML === "O"){
                scoreCount --;
            }
        }
        if (scoreCount === 3){
            console.log("X wins!");
            updater.winner = "X"
        }
        else if (scoreCount === -3){
            console.log("O wins!");
            updater.winner = "O"
        }
    }
}

const updater = {
    socket: null,
    winner: null,
    displayMove: (id, nought_or_cross)=> {
        document.getElementById(id).innerHTML = nought_or_cross; // Inserts either an O or X, properly formatted to fill the box
    },
    resetGame: () => {
        updater.winner = false;
        playerToMove = Math.floor(Math.random() * playerToStartOptions.length);
        document.getElementById("winnerName").innerHTML = "";
        document.getElementById("winner_announcement").style.display = "none";
        createBoard();
    },
    start: () => {
        const url = "wss://" + location.host + "/noughts_and_crosses_socket"; // builds a url for creating the websocket below
        updater.socket = new WebSocket(url);
        updater.socket.onmessage = (event) => {
            infoAsJSON = JSON.parse(event.data);
            
            if(infoAsJSON.message_info === "RESET") {
                updater.resetGame();
            }
            else{
                if (infoAsJSON.player === "Player1" && playerToMove === "Player1"){
                    symbol = "X";
                    playerToMove = "Player2";
                    updater.displayMove(infoAsJSON.message_info, symbol)
                    checkIfWin(winConditions)
                }
                else if (infoAsJSON.player === "Player2" && playerToMove === "Player2"){
                    symbol = "O";
                    playerToMove = "Player1";
                    updater.displayMove(infoAsJSON.message_info, symbol);
                    checkIfWin(winConditions)
                }
                if(updater.winner){
                    document.getElementById("winnerName").innerHTML = updater.winner;
                    document.getElementById("winner_announcement").style.display = "block";
                }
            }
        }
    }
}

const updateMove = (elementIdToBeUpdated) => {
    updater.socket.send(elementIdToBeUpdated); // hard coded int for now?
}
const playerToStartOptions = ["Player1", "Player2"];


$(document).ready(() => {
    createBoard()
    $(".gameSquare").on("click", () => {
        console.log("click detected")
        if(!updater.winner){
            console.log("no winner yet!")
        updateMove(event.target.id);
        }
    })
    $("#reset_button").on("click", () => {
        updater.socket.send("RESET");
    })
    updater.start()
});