let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let box = 20;
let snake = [];
snake[0] = { x: 8 * box, y: 8 * box };
let direction = null;
let food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
let gameOverDiv = document.getElementById('gameOver');
let playAgainButton = document.getElementById('playAgain');
let game;

document.addEventListener('keydown', changeDirection);
playAgainButton.addEventListener('click', startGame);

function startGame() {
    gameOverDiv.style.display = 'none';
    direction = null;
    snake = [];
    snake[0] = { x: 8 * box, y: 8 * box };
    food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
    game = setInterval(draw, 100);
}

function changeDirection(event) {
    if(event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
    else if(event.keyCode === 38 && direction !== 'DOWN') direction = 'UP';
    else if(event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
    else if(event.keyCode === 40 && direction !== 'UP') direction = 'DOWN';
}

function collision(newHead, snakeArray) {
    for(let i = 0; i < snakeArray.length; i++) {
        if(newHead.x === snakeArray[i].x && newHead.y === snakeArray[i].y) return true;
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'lightgreen';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(direction === 'LEFT') snakeX -= box;
    if(direction === 'UP') snakeY -= box;
    if(direction === 'RIGHT') snakeX += box;
    if(direction === 'DOWN') snakeY += box;

    if(snakeX === food.x && snakeY === food.y) {
        food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if(snakeX < 0 || snakeY < 0 || snakeX >= 400 || snakeY >= 400 || collision(newHead, snake)) {
        clearInterval(game);
        gameOverDiv.style.display = 'block';
        return;
    }

    snake.unshift(newHead);
}

startGame();

