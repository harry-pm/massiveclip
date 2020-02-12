const createBoard = () => {
    HTMLToInject = ""
    for(j = 0; j < 9; j+=3){
        rowHTML = []
        for(i = j; i < (j + 3); i++){
            rowHTML.push(`<div class="gameSquare" id="button${i}">Game piece</div>`)
        }
        HTMLToInject += `<div class="row">${rowHTML.join("")}</div>`
    }
    console.log(HTMLToInject);
    document.getElementById('gameBoard').innerHTML = (HTMLToInject)
}

$(document).ready(() => {
    createBoard()
});