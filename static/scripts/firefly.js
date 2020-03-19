var myGamePiece;
var myObstacles = [];
var myScore;


myGamePiece = new component(8, 6, "orange", 10, 160, "firefly");
myGamePiece.gravity = 0.05;
myScore = new component("30px", "Consolas", "black", 280, 40, "score");
gameOverMessage = new component("30px", "Consolas", "black", 170, 140, "gameOverMessage");
playAgainMessage = new component("30px", "Consolas", "black", 70, 180, "playAgain");


//flying control
window.addEventListener('keydown', function (e) {
    if (e.keyCode == '38') {
        accelerate(-0.2);
    };
})
window.addEventListener('keyup', function (e) {
    if (e.keyCode == '38') {
        accelerate(0.05);
    };
})


//canvas 
var myGameArea = {
    canvas : document.getElementById("myCanvas"),
    start : function() {
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 10);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function () {
        clearInterval(this.interval);
    }
}

//Game piece components
function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;

        //draw score
        if (this.type == "score") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);

        //draw firefly
        } else if (this.type == "firefly") {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.ellipse(this.x, this.y, this.width, this.height, 0, 0, 2 * Math.PI);
            ctx.fill();

        //draw gamover
        } else if (this.type == "gameOverMessage") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText("Gameover", this.x, this.y);
        
        //draw playagain
        } else if (this.type == "playAgain") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText("Press space to play again", this.x, this.y);

        //draw rectangles
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {

        //if the firefly crashes
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            gameOverMessage.update();
            playAgainMessage.update();

            //save the score
            let xhr = new XMLHttpRequest();
            let username = document.getElementById('name').innerHTML;
            let score = myGameArea.frameNo;

            //update the user high score
            current_highscore = document.getElementById("score").innerHTML;
            if (score > current_highscore || current_highscore === "No highscore yet!") {
                document.getElementById("score").innerHTML = score;
            }

            //update table
            row_username = document.getElementsByClassName("row_username");
            row_score = document.getElementsByClassName("row_score");
            
            let users_and_scores = [[username, score]];
            for (let i = 0; i < row_username.length; i++) {
                users_and_scores.push([row_username[i].innerHTML, parseInt(row_score[i].innerHTML)])
            };

            users_and_scores.sort((a,b) => b[1] - a[1]);
            if (users_and_scores.length > 5) {
                users_and_scores = users_and_scores.slice(0,5);
            };

            let html_array = [];
            for (let i = 0; i < users_and_scores.length; i ++) {
                html_array.push(`<tr><td>${i + 1}</td><td class="row_username">${users_and_scores[i][0]}</td><td class="row_score">${users_and_scores[i][1]}</td></tr>`)
            };

            document.getElementById("highscores_table").innerHTML = html_array.join("");

            //FOR MASTER BRANCH
            // xhr.open("GET", 'http://massiveclip.herokuapp.com/api/save_firefly_score?'+"username=" + username + "&" + "firefly_score=" + score , true);

            //FOR DEVELOPMENT
            xhr.open("GET", 'http://localhost:8000/api/save_firefly_score?'+"username=" + username + "&" + "firefly_score=" + myGameArea.frameNo, true);

            xhr.send();

            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height + 500000, "white", x, -500000));
        myObstacles.push(new component(10, x - height - gap, "white", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

myGameArea.start();

window.addEventListener('keydown', function (e) {
    if (e.keyCode == '32') {
        myGameArea.stop();
        myObstacles = [];
        myGameArea.clear();
        myGameArea.start();
    };
});

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}