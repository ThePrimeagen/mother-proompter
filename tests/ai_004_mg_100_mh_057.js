(function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.getElementById('gameDiv').appendChild(canvas);

    canvas.width = 400;
    canvas.height = 400;

    const gridSize = 20;
    const gridCount = canvas.width / gridSize;

    let snake = [{ x: 10, y: 10 }];
    let direction = { x: 0, y: 0 };
    let food = getRandomPosition();
    let gameOver = false;

    document.addEventListener('keydown', changeDirection);

    function changeDirection(event) {
        const key = event.keyCode;
        const goingUp = direction.y === -1;
        const goingDown = direction.y === 1;
        const goingRight = direction.x === 1;
        const goingLeft = direction.x === -1;

        if (key === 37 && !goingRight) direction = { x: -1, y: 0 };
        if (key === 38 && !goingDown) direction = { x: 0, y: -1 };
        if (key === 39 && !goingLeft) direction = { x: 1, y: 0 };
        if (key === 40 && !goingUp) direction = { x: 0, y: 1 };
    }

    function getRandomPosition() {
        return {
            x: Math.floor(Math.random() * gridCount),
            y: Math.floor(Math.random() * gridCount),
        };
    }

    function gameLoop() {
        if (gameOver) return showGameOver();
        update();
        draw();

        setTimeout(gameLoop, 100);
    }

    function update() {
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        if (head.x === food.x && head.y === food.y) {
            snake.push({});
            food = getRandomPosition();
        }

        if (head.x < 0 || head.x >= gridCount || head.y < 0 || head.y >= gridCount || collision(head)) {
            gameOver = true;
        }

        if (!gameOver) {
            snake.unshift(head);
            snake.pop();
        }
    }

    function collision(position) {
        return snake.some(segment => segment.x === position.x && segment.y === position.y);
    }

    function draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

        ctx.fillStyle = 'lime';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
    }

    function showGameOver() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.font = '20px Arial';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        ctx.fillText('Press Enter to Restart', canvas.width / 2, canvas.height / 2 + 30);

        document.addEventListener('keydown', function restart(event) {
            if (event.keyCode === 13) { // Enter key
                document.removeEventListener('keydown', restart);
                resetGame();
            }
        });
    }

    function resetGame() {
        snake = [{ x: 10, y: 10 }];
        direction = { x: 0, y: 0 };
        food = getRandomPosition();
        gameOver = false;
        gameLoop();
    }

    gameLoop();
})();

