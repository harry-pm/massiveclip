var canvas = document.getElementById('game');
var context = canvas.getContext('2d');


var grid = 16;
var count = 0;
var score = 0;
var gameOver = false;

var snake = {
    x: 160,
    y: 160,
    
    // snake velocity. moves one grid length every frame in either the x or y direction
    dx: grid,
    dy: 0,
    
    // keep track of all grids the snake body occupies
    cells: [],
    
    // length of the snake. grows when eating an apple
  maxCells: 4
};
var apple = {
    x: 320,
    y: 320
};

// get random whole numbers in a specific range
// @see https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// game loop
function loop() {
    requestAnimationFrame(loop);
    
    if (gameOver === false) {

    // slow game loop to 15 fps instead of 60 (60/15 = 4)
    if (++count < 4) {
        return;
    }
    
    count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);
  
  // move snake by it's velocity
  snake.x += snake.dx;
  snake.y += snake.dy;
  
  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
      snake.x = canvas.width - grid;
    }
    else if (snake.x >= canvas.width) {
        snake.x = 0;
    }
    
    // wrap snake position vertically on edge of screen
    if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
      snake.y = 0;
    }
    
  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({x: snake.x, y: snake.y});

  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
      snake.cells.pop();
    }
    
    //draw score
    context.font = "15px Georgia";
    context.fillText("Score " + score, 20, 20)
    
    // draw apple
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid-1, grid-1);
  
    // draw snake one cell at a time
    context.fillStyle = 'green';
    snake.cells.forEach(function(cell, index) {
    
    // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
    context.fillRect(cell.x, cell.y, grid-1, grid-1);  

    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;

      // canvas is 400x400 which is 25x25 grids 
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    // check collision with all cells after this one (modified bubble sort)
    for (var i = index + 1; i < snake.cells.length; i++) {
      
      // snake occupies same space as a body part. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        gameOver = true;
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;

        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }
    }
  });
}
else {
    context.font = "25px Georgia";
    context.fillText("Game Over    Score: " + score, 90, 100)
    context.fillText("Press SPACE to SAVE SCORE", 40, 180)
    context.fillText("    & PLAY AGAIN", 90, 220)
  }
}




// listen to keyboard events to move the snake
document.addEventListener('keydown', function(e) {
  // prevent snake from backtracking on itself by checking that it's 
  // not already moving on the same axis (pressing left while moving
  // left won't do anything, and pressing right while moving left
  // shouldn't let you collide with your own body)
  
  // left arrow key
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // up arrow key
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // right arrow key
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // down arrow key
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
  
  //updating highscores and playing again
  else if (gameOver === true && e.which === 32) {
    let xhr = new XMLHttpRequest()
    let username = this.getElementById('name').innerHTML;
    
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
    // xhr.open("GET", 'http://massiveclip.herokuapp.com/api/save_snake_score?'+"username=" + username + "&" + "snake_score=" + score , true);

    //FOR DEVELOPMENT
    xhr.open("GET", 'http://localhost:8000/api/save_snake_score?'+"username=" + username + "&" + "snake_score=" + score , true);

    xhr.send();
    gameOver = false;
    score = 0;
  }
});

// start the game
requestAnimationFrame(loop);