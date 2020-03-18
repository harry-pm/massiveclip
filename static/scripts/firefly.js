var myGamePiece;
var myObstacles = [];
var myScore;


myGamePiece = new component(8, 6, "orange", 10, 160, "firefly");
myGamePiece.gravity = 0.05;
myScore = new component("30px", "Consolas", "black", 280, 40, "score");
gameOver = new component("30px", "Consolas", "black", 170, 140, "gameOver");
playAgain = new component("30px", "Consolas", "black", 50, 180, "playAgain");



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
        } else if (this.type == "gameOver") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText("Gameover", this.x, this.y);
        
        //draw playagain
        } else if (this.type == "playAgain") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText("Press any key to play again", this.x, this.y);

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
        if (myGamePiece.crashWith(myObstacles[i])) {
            //add functionality here to send score to db
            myGameArea.stop();
            gameOver.update();
            playAgain.update();
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
        this.console.log('go again')
        // myGameArea.start();
    };
});

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}