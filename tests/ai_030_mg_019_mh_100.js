const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
const endScreen = document.getElementById('end-screen');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [
    { x: 10, y: 10 }
];
let velocity = { x: 0, y: 0 };
let apple = { x: 5, y: 5 };
let snakeLength = 1;
let gameOver = false;

function gameLoop() {
    if (gameOver) {
        endScreen.style.display = 'block';
        return;
    }

    update();
    draw();

    setTimeout(gameLoop, 1000 / 10);
}

function update() {
    const head = { ...snake[0] };
    head.x += velocity.x;
    head.y += velocity.y;

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
    }

    snake = [head, ...snake.slice(0, snakeLength - 1)];

    if (head.x === apple.x && head.y === apple.y) {
        snakeLength++;
        apple.x = Math.floor(Math.random() * tileCount);
        apple.y = Math.floor(Math.random() * tileCount);
    }
}

function draw() {
    context.fillStyle = '#222';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'lime';
    snake.forEach(segment => {
        context.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    context.fillStyle = 'red';
    context.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 2, gridSize - 2);
}

document.addEventListener('keydown', ({ key }) => {
    if (key === 'ArrowUp' && velocity.y === 0) velocity = { x: 0, y: -1 };
    if (key === 'ArrowDown' && velocity.y === 0) velocity = { x: 0, y: 1 };
    if (key === 'ArrowLeft' && velocity.x === 0) velocity = { x: -1, y: 0 };
    if (key === 'ArrowRight' && velocity.x === 0) velocity = { x: 1, y: 0 };
});

document.addEventListener('keydown', ({ key }) => {
    if (key === ' ' && gameOver) {
        snake = [{ x: 10, y: 10 }];
        velocity = { x: 0, y: 0 };
        apple = { x: 5, y: 5 };
        snakeLength = 1;
        gameOver = false;
        endScreen.style.display = 'none';
        gameLoop();
    }
});

gameLoop();

