document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const gameOverDiv = document.getElementById('game-over');

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    let snake = [{ x: 10, y: 10 }];
    let velocity = { x: 0, y: 0 };
    let food = { x: 15, y: 15 };
    let gameOver = false;

    function drawGame() {
        updateSnakePosition();
        if (gameOver) {
            gameOverDiv.style.display = 'block';
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake();
        drawFood();
    }

    function updateSnakePosition() {
        let headX = snake[0].x + velocity.x;
        let headY = snake[0].y + velocity.y;

        snake.unshift({ x: headX, y: headY });

        // Check for collision with walls
        if (headX < 0 || headX >= tileCount || headY < 0 || headY >= tileCount) {
            gameOver = true;
        }

        // Check for collision with self
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === headX && snake[i].y === headY) {
                gameOver = true;
            }
        }

        // Check if snake eats food
        if (headX === food.x && headY === food.y) {
            food = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        } else {
            snake.pop();
        }
    }

    function drawSnake() {
        snake.forEach((segment) => {
            ctx.fillStyle = 'lime';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
    }

    function drawFood() {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                if (velocity.y === 0) {
                    velocity = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
                if (velocity.y === 0) {
                    velocity = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
                if (velocity.x === 0) {
                    velocity = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
                if (velocity.x === 0) {
                    velocity = { x: 1, y: 0 };
                }
                break;
        }
    });

    function restartGame() {
        snake = [{ x: 10, y: 10 }];
        velocity = { x: 0, y: 0 };
        food = { x: 15, y: 15 };
        gameOver = false;
        gameOverDiv.style.display = 'none';
        setInterval(drawGame, 1000 / 15);
    }

    setInterval(drawGame, 1000 / 15);
});

