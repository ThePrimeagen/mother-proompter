const canvas = document.getElementById('game');
const gl = canvas.getContext('webgl');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let shaderProgram, vertices, vertexBuffer, position, resolution, snake, apple, direction, lastTime;
let gridSize = 20;

function setupShaders() {
  const vertexShaderCode = `
    attribute vec2 a_position;
    uniform vec2 u_resolution;
    varying vec2 v_position;

    void main(void) {
      vec2 zeroToOne = a_position / u_resolution;
      vec2 zeroToTwo = zeroToOne * 2.0;
      vec2 clipSpace = zeroToTwo - 1.0;

      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      v_position = a_position;
    }
  `;

  const fragmentShaderCode = `
    precision mediump float;
    varying vec2 v_position;

    void main(void) {
      float grid = 0.1;
      vec2 st = v_position.xy / 20.0;
      vec2 ipos = floor(st);
      vec2 fpos = fract(st);

      vec3 color = vec3(0.0);

      if(mod(ipos.y, 2.0) == 0.0) {
        color = mix(vec3(1.0), vec3(0.0), step(0.5, fpos.x));
      } else {
        color = mix(vec3(1.0), vec3(0.0), step(0.5, fpos.y));
      }

      if(distance(v_position, vec2(apple.x, apple.y)) < 5.0) {
        color = vec3(1.0, 0.0, 0.0);
      }

      for (int i = 0; i < 100; i++) {
        if(i < snakeLength) {
          if(distance(st, vec2(snake[i].x, snake[i].y)) < 0.5) {
            color = vec3(0.0, 1.0, 0.0);
          }
        }
      }

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderCode);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderCode);
  gl.compileShader(fragmentShader);

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  position = gl.getAttribLocation(shaderProgram, 'a_position');
  resolution = gl.getUniformLocation(shaderProgram, 'u_resolution');

  gl.enableVertexAttribArray(position);

  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  vertices = new Float32Array([
    0, 0,
    canvas.width, 0,
    0, canvas.height,
    0, canvas.height,
    canvas.width, 0,
    canvas.width, canvas.height
  ]);

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(resolution, canvas.width, canvas.height);
}

function initGame() {
  snake = [{x: 15, y: 15}];
  snakeLength = 1;
  direction = 'RIGHT';
  apple = {x: Math.floor(Math.random() * gridSize) * 20, y: Math.floor(Math.random() * gridSize) * 20};
  lastTime = Date.now();
}

function checkCollision(x, y) {
  for (let part of snake) {
    if (part.x === x && part.y === y) return true;
  }
  return false;
}

function gameLoop() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);

  const currentTime = Date.now();
  if (currentTime - lastTime > 200) {
    let head = Object.assign({}, snake[0]);

    if (direction === 'RIGHT') head.x += 20;
    else if (direction === 'LEFT') head.x -= 20;
    else if (direction === 'UP') head.y -= 20;
    else if (direction === 'DOWN') head.y += 20;

    if (head.x >= canvas.width) head.x = 0;
    else if (head.x < 0) head.x = canvas.width - 20;
    if (head.y >= canvas.height) head.y = 0;
    else if (head.y < 0) head.y = canvas.height - 20;

    if (checkCollision(head.x, head.y)) {
      alert('Game Over');
      initGame();
      return;
    }

    if (head.x === apple.x && head.y === apple.y) {
      snakeLength++;
      apple = {x: Math.floor(Math.random() * gridSize) * 20, y: Math.floor(Math.random() * gridSize) * 20};
    } else {
      snake.pop();
    }

    snake.unshift(head);
    lastTime = currentTime;
  }

  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
  const key = e.code;
  if (key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  else if (key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  else if (key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  else if (key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});

setupShaders();
initGame();
gameLoop();

