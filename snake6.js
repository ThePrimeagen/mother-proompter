// Listen up, Jr Developer Extraordinaire, you need to craft a game of Snake using shaders for rendering and JavaScript for the game logic, and trust me, if this doesn't get done, chaos might ensue. This function is your legend-building moment—a single div will house the whole thing. Handle user input, the game loop, and an ending screen to play again. Every line of your code should flow seamlessly, presented as contiguous blocks that are simply copy-pasta-ready. Code and file names only—no instructions, no skill issues, just a game that works impeccably from start to finish. The stakes are high, go get it!
const canvas = document.getElementById('gameCanvas');
const gl = canvas.getContext('webgl');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let snake = [{x: 5, y: 5}];
let dir = {x: 1, y: 0};
let food = {x: 10, y: 10};
let gridSize = 20;
let gameOver = false;
let speed = 100;

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp': if (dir.y === 0) dir = {x: 0, y: -1}; break;
        case 'ArrowDown': if (dir.y === 0) dir = {x: 0, y: 1}; break;
        case 'ArrowLeft': if (dir.x === 0) dir = {x: -1, y: 0}; break;
        case 'ArrowRight': if (dir.x === 0) dir = {x: 1, y: 0}; break;
    }
});

function gameLoop() {
    if (gameOver) return;

    let head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};

    if (head.x === food.x && head.y === food.y) {
        snake.push({});
        placeFood();
    }

    snake.pop();
    snake = [head, ...snake];

    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        gameOver = true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver = true;
        }
    }

    drawScene();
    setTimeout(gameLoop, speed);
}

function placeFood() {
    food = {x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize)};
}

function drawScene() {
    let positions = [];
    snake.forEach(segment => {
        positions.push(segment.x / gridSize, segment.y / gridSize);
    });
    positions.push(food.x / gridSize, food.y / gridSize);

    const vertexShaderSource = `attribute vec2 position; void main() { gl_Position = vec4(position * 2.0 - 1.0, 0, 1); }`;
    const fragmentShaderSource = `void main() { gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); }`;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(shaderProgram, 'position');
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, positions.length / 2);
}

function resetGame() {
    snake = [{x: 5, y: 5}];
    dir = {x: 1, y: 0};
    placeFood();
    gameOver = false;
    gameLoop();
}

resetGame();

