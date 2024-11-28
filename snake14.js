(function () {
    const gameContainer = document.getElementById("game-container");
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");
    const gameOverDiv = document.getElementById("game-over");
    const restartButton = document.getElementById("restart-button");

    const TILE_SIZE = 20;
    const TILES_X = canvas.width / TILE_SIZE;
    const TILES_Y = canvas.height / TILE_SIZE;

    let snake, direction, apple, gameInterval, score, gameRunning;

    function initializeGame() {
        snake = [{ x: 5, y: 5 }];
        direction = { x: 1, y: 0 };
        apple = { x: getRandomInt(TILES_X), y: getRandomInt(TILES_Y) };
        score = 0;
        gameRunning = true;
        gameOverDiv.style.display = "none";
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 100);
    }

    function gameLoop() {
        update();
        draw();
    }

    function update() {
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        if (head.x < 0 || head.y < 0 || head.x >= TILES_X || head.y >= TILES_Y || isCollidingWithSnake(head)) {
            endGame();
            return;
        }

        snake.unshift(head);

        if (head.x === apple.x && head.y === apple.y) {
            score++;
            apple = getNewApplePosition();
        } else {
            snake.pop();
        }
    }

    function draw() {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#0f0";
        snake.forEach((segment) => {
            ctx.fillRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        });

        ctx.fillStyle = "#f00";
        ctx.fillRect(apple.x * TILE_SIZE, apple.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    function isCollidingWithSnake(position) {
        return snake.some((segment) => segment.x === position.x && segment.y === position.y);
    }

    function getNewApplePosition() {
        let newApple;
        do {
            newApple = { x: getRandomInt(TILES_X), y: getRandomInt(TILES_Y) };
        } while (isCollidingWithSnake(newApple));
        return newApple;
    }

    function endGame() {
        gameRunning = false;
        clearInterval(gameInterval);
        gameOverDiv.style.display = "block";
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function handleInput(event) {
        const keyMap = {
            ArrowUp: { x: 0, y: -1 },
            ArrowDown: { x: 0, y: 1 },
            ArrowLeft: { x: -1, y: 0 },
            ArrowRight: { x: 1, y: 0 },
        };

        const newDirection = keyMap[event.key];
        if (newDirection) {
            if (
                !(
                    snake.length > 1 &&
                    newDirection.x === -direction.x &&
                    newDirection.y === -direction.y
                )
            ) {
                direction = newDirection;
            }
        }
    }

    restartButton.addEventListener("click", initializeGame);
    document.addEventListener("keydown", handleInput);

    initializeGame();
})();


