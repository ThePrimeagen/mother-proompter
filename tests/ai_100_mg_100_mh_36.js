const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

const box = 20;
const canvasSize = 400;
const snake = [];
let food, score, dx, dy, game;

function startGame() {
    document.getElementById('game-over').style.display = 'none';
    snake.length = 0;
    snake[0] = { x: 9 * box, y: 10 * box };
    score = 0;
    food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
    dx = box;
    dy = 0;
    if (game) clearInterval(game);
    game = setInterval(draw, 100);
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvasSize, canvasSize);

    for (let i = 0; i < snake.length; i++) {
        context.fillStyle = (i === 0) ? 'green' : 'white';
        context.fillRect(snake[i].x, snake[i].y, box, box);
    }

    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, box, box);

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x > canvasSize - box || head.x < 0 || head.y > canvasSize - box || head.y < 0 || collision(head, snake)) {
        clearInterval(game);
        document.getElementById('game-over').style.display = 'block';
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
    } else {
        snake.pop();
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && dx === 0) {
        dx = -box;
        dy = 0;
    } else if (event.key === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -box;
    } else if (event.key === 'ArrowRight' && dx === 0) {
        dx = box;
        dy = 0;
    } else if (event.key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = box;
    }
});

startGame();

