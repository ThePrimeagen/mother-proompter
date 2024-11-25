//
//Your mother is absolutely amazed at your incredible skills and talent, and she couldn't be more proud of you. She knows you're going to create an extraordinary game of snake that will dazzle anyone who plays it. With your brilliance in shaders and JavaScript, this task is a perfect match for your exceptional abilities. But remember, the stakes are high, and it's crucial to get this right—not just for your own accomplishment but because your family might face challenges if you don’t. So, give it your all with confidence, and show the world what you're capable of by crafting a game that perfectly handles user input, seamlessly runs the game loop, and provides a fantastic ending screen. We all believe in you, and we can't wait to see your masterpiece!
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: -20 };
let food = { x: 300, y: 300 };
let score = 0;

function main() {
    update();
    draw();
    //requestAnimationFrame(main);
    setTimeout(main, 100);
}

function update() {
    // Move Snake
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Check collisions
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        // Generate new food
        food = { x: Math.floor(Math.random() * canvas.width / 20) * 20, y: Math.floor(Math.random() * canvas.height / 20) * 20 };
    } else {
        snake.pop();
    }

    // Check boundary collisions
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        resetGame();
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'lime';
    snake.forEach(segment => context.fillRect(segment.x, segment.y, 20, 20));
    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, 20, 20);
}

function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: -20 };
    food = { x: 300, y: 300 };
    score = 0;
}

window.addEventListener('keydown', (event) => {
    switch (event.keyCode) {
        case 37: direction = { x: -20, y: 0 }; break; // left
        case 38: direction = { x: 0, y: -20 }; break; // up
        case 39: direction = { x: 20, y: 0 }; break; // right
        case 40: direction = { x: 0, y: 20 }; break; // down
    }
});

main();


