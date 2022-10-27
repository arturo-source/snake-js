const SQUARE_SIZE = 20;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 800;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// set width and height full screen
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Snake game
var snake = {
    body: [
        {x: 400, y: 400},
    ],
    nextMove: 'right',
};

// Food
var food = {
    x: 0,
    y: 0,
};

// Game
var game = {
    score: 0,
    speed: 100,
};

// Draw snake
function drawSnake() {
    // Draw head
    ctx.fillStyle = '#3a5a40';
    ctx.fillRect(snake.body[0].x, snake.body[0].y, SQUARE_SIZE, SQUARE_SIZE);

    // Draw body
    ctx.fillStyle = '#a3b18a';
    snake.body.slice(1).forEach(function (part) {
        ctx.fillRect(part.x, part.y, SQUARE_SIZE, SQUARE_SIZE);
    });
}

// Draw food
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, SQUARE_SIZE, SQUARE_SIZE);
}

// Draw score
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + game.score, 10, 30);
}

// Draw game over
function drawGameOver() {
    ctx.fillStyle = 'black';
    ctx.font = '50px Arial';
    ctx.fillText('Game Over', 200, 400);
}

// Draw game
function drawGame() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    drawSnake();
    drawFood();
    drawScore();
}

// Move snake
function moveSnake() {
    var head = snake.body[0];
    var newHead = {
        x: head.x,
        y: head.y,
    };
    switch (snake.nextMove) {
        case 'right':
            newHead.x += SQUARE_SIZE;
            break;
        case 'left':
            newHead.x -= SQUARE_SIZE;
            break;
        case 'up':
            newHead.y -= SQUARE_SIZE;
            break;
        case 'down':
            newHead.y += SQUARE_SIZE;
            break;
    }
    snake.body.unshift(newHead);
    snake.body.pop();
}

// Check if snake is out of game
function isSnakeOutOfGame() {
    var head = snake.body[0];
    return head.x < 0 || head.x >= GAME_WIDTH || head.y < 0 || head.y >= GAME_HEIGHT;
}

// Check if snake is eating food
function isSnakeEatingFood() {
    var head = snake.body[0];
    return head.x === food.x && head.y === food.y;
}

// Check if snake is eating itself
function isSnakeEatingItself() {
    var head = snake.body[0];
    return snake.body.slice(1).some(function (part) {
        return part.x === head.x && part.y === head.y;
    });
}

// Check if game is over
function isGameOver() {
    return isSnakeOutOfGame() || isSnakeEatingItself();
}

// Generate food
function generateFood() {
    food.x = Math.floor(Math.random() * (GAME_WIDTH / SQUARE_SIZE)) * SQUARE_SIZE;
    food.y = Math.floor(Math.random() * (GAME_HEIGHT / SQUARE_SIZE)) * SQUARE_SIZE;
}

// Handle key down
function handleKeyDown(e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (snake.nextMove !== 'right') {
                snake.nextMove = 'left';
            }
            break;
        case 'ArrowUp':
            if (snake.nextMove !== 'down') {
                snake.nextMove = 'up';
            }
            break;
        case 'ArrowRight':
            if (snake.nextMove !== 'left') {
                snake.nextMove = 'right';
            }
            break;
        case 'ArrowDown':
            if (snake.nextMove !== 'up') {
                snake.nextMove = 'down';
            }
            break;
    }
}

// Main game loop
function main() {
    if (isGameOver()) {
        drawGameOver();
        return;
    }
    if (isSnakeEatingFood()) {
        snake.body.push({});
        game.score += 1;
        game.speed -= 1;
        generateFood();
    }
    moveSnake();
    drawGame();
    setTimeout(main, game.speed);
}

// Start game
function startGame() {
    generateFood();
    main();
}

// Add event listener
document.addEventListener('keydown', handleKeyDown);
startGame();