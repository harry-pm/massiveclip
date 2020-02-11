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
        message_to_send = $("input:text").val();
        console.log(message_to_send);
        sendMessage(message_to_send);
        return false;
    });
    updater.start()
})

