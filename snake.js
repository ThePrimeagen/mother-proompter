const gameContainer = document.getElementById('gameContainer');

class SnakeGame {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.gl = this.canvas.getContext('webgl');
        this.initShaders();
        this.initGame();
    }

    initShaders() {
        const vertexShaderSource = `
            attribute vec4 a_position;
            void main() {
                gl_Position = a_position;
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            uniform vec4 u_color;
            void main() {
                gl_FragColor = u_color;
            }
        `;

        this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        this.fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        this.program = this.createProgram(this.vertexShader, this.fragmentShader);

        this.positionLocation = this.gl.getAttribLocation(this.program, "a_position");
        this.colorLocation = this.gl.getUniformLocation(this.program, "u_color");
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error(this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    createProgram(vertexShader, fragmentShader) {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error(this.gl.getProgramInfoLog(program));
            this.gl.deleteProgram(program);
            return null;
        }
        return program;
    }

    initGame() {
        this.container.appendChild(this.canvas);
        this.boundGameLoop = this.gameLoop.bind(this);
        this.resetGame();
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        requestAnimationFrame(this.boundGameLoop);
    }

    resetGame() {
        // Initialize or reset game state
        this.snake = [{x: 0, y: 0}, {x: 1, y: 0}];
        this.direction = {x: 1, y: 0};
        this.apple = {x: Math.random() * 10 | 0, y: Math.random() * 10 | 0};
        this.gameOver = false;
    }

    gameLoop() {
        if (this.gameOver) {
            this.showEndScreen();
        } else {
            this.update();
            this.render();
            requestAnimationFrame(this.boundGameLoop);
        }
    }

    handleKeyDown(event) {
        switch (event.key) {
            case 'ArrowUp': this.direction = {x: 0, y: 1}; break;
            case 'ArrowDown': this.direction = {x: 0, y: -1}; break;
            case 'ArrowLeft': this.direction = {x: -1, y: 0}; break;
            case 'ArrowRight': this.direction = {x: 1, y: 0}; break;
        }
    }

    update() {
        const head = {x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y};
        this.snake.unshift(head);
        if (head.x === this.apple.x && head.y === this.apple.y) {
            this.apple = {x: Math.random() * 10 | 0, y: Math.random() * 10 | 0};
        } else {
            this.snake.pop();
        }

        if (this.checkCollision()) {
            this.gameOver = true;
        }
    }

    render() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Render snake
        this.gl.useProgram(this.program);
        const snakeColor = [0.5, 0.5, 0.5, 1.0];
        this.gl.uniform4fv(this.colorLocation, snakeColor);
        for (const segment of this.snake) {
            this.drawRectangle(segment.x / 10, segment.y / 10, 0.1, 0.1);
        }

        // Render apple
        const appleColor = [1.0, 0.0, 0.0, 1.0];
        this.gl.uniform4fv(this.colorLocation, appleColor);
        this.drawRectangle(this.apple.x / 10, this.apple.y / 10, 0.1, 0.1);
    }

    drawRectangle(x, y, width, height) {
        const x1 = x;
        const x2 = x + width;
        const y1 = y;
        const y2 = y + height;

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            x1, y1, x2, y1, x1, y2,
            x1, y2, x2, y1, x2, y2,
        ]), this.gl.STATIC_DRAW);

        this.gl.enableVertexAttribArray(this.positionLocation);
        this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    checkCollision() {
        const head = this.snake[0];
        if (head.x < 0 || head.x > 9 || head.y < 0 || head.y > 9) {
            return true;
        }
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
                return true;
            }
        }
        return false;
    }

    showEndScreen() {
        // Placeholder for ending screen
        alert('Game Over! Press OK to play again.');
        this.resetGame();
    }
}

new SnakeGame(gameContainer);

