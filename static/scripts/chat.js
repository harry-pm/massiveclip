const updater = {
    socket: null,

    displayMessage: (message, html_id) => {
        document.getElementById(html_id).innerHTML += "<p>" + message + "</p>";
    },

    start: () => {
        const url = "wss://" + location.host + "/chatsocket"; // This should plug right in to the heroku hosted version
        updater.socket = new WebSocket(url);
        updater.socket.onmessage = (message) => {
            console.log("message received!" + message.data);
            updater.displayMessage(message.data, "messages-container"); // extracts the html from the message received
        }
    }
}

function sendMessage(message) {
    updater.socket.send(message);
}

$(document).ready(() => {
    $("#send-message").on("click", function() {
        username = document.getElementById("username").innerHTML;
        message = $("input:text").val();
        dateSent = new Date();
        dateSentString = dateSent.toString().substring(0, 24);
        messageToSend = `${username}: ${message} - Sent on ${dateSentString}`;
        sendMessage(messageToSend);
        message = $("input:text").val("");
        return false;
    });
    updater.start();
})

