const updater = {
    socket: null,

    displayMessage: (message, html_id) => {
        // document.getElementById(html_id).innerHTML += message_html;
        document.getElementById(html_id).innerHTML += "<p>" + message + "</p>";
    },

    start: () => {
        const url = "ws://" + location.host + "/chatsocket"; // This should plug right in to the heroku hosted version
        updater.socket = new WebSocket(url);
        updater.socket.onmessage = (message) => {
            console.log("message received!" + message.data)

            updater.displayMessage(message.data, "messages-container") // extracts the html from the message received
        }
    // },
    // start: () => {
    //     const url = "ws://" + location.host + "/gamesocket"; // builds a url for creating the websocket below
    //     updater.socket = new WebSocket(url); // opens up a new websocket based on the url built above
    //     updater.socket.onmessage = (event) => {
    //         updater.displayButtonColorChange((event.data)) // showMessage is defined above - it just displays the updated number of clicks for now, injecting it into index html
    //     }
    }
}

function sendMessage(message) {
    updater.socket.send(message);
    // form.find("input[type=text]").val("").select();
}

jQuery.fn.formToDict = function() {
    var fields = this.serializeArray();
    var json = {}
    for (var i = 0; i < fields.length; i++) {
        json[fields[i].name] = fields[i].value;
    }
    if (json.next) delete json.next;
    return json;
};

$(document).ready(() => {

    $("#send-message").on("click", function() {
        username = $("[id=username]").val();
        console.log("username " + username);
        message = $("input:text").val();
        dateSent = Date.now()
        messageToSend = `${username}: ${message} - Sent on ${dateSent} - STILL TO DO: IMPLEMENT NICE TIMESTAMPS AND THE USERNAME SENDING THE MESSAGE`
        console.log(messageToSend);
        sendMessage(messageToSend);
        message = $("input:text").val("");

        return false;
    });

    // $("#send-message").on("keypress", function(e) { // for sending messages with enter key
    //     if (e.keyCode == 13) {
    //         username = $("[id=username]").val();
    //         console.log("username " + username);
    //         message = $("input:text").val();
    //         dateSent = Date.now()
    //         messageToSend = `${username}: ${message} - Sent on ${dateSent} - STILL TO DO: IMPLEMENT NICE TIMESTAMPS AND THE USERNAME SENDING THE MESSAGE`
    //         console.log(messageToSend);
    //         sendMessage(messageToSend);
    //         return false;
    //     }
    // });
    updater.start()
})

