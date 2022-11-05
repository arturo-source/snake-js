const SQUARE_SIZE = 20;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 400;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// set width and height full screen
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Snake game
var snake = {
    body: [
        { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 },
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
    snake.nextMove = snake.Run();

    let head = snake.body[0];
    let newHead = {
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
    let head = snake.body[0];
    return head.x < 0 || head.x >= GAME_WIDTH || head.y < 0 || head.y >= GAME_HEIGHT;
}

// Check if snake is eating food
function isSnakeEatingFood() {
    let head = snake.body[0];
    return head.x === food.x && head.y === food.y;
}

// Check if snake is eating itself
function isSnakeEatingItself() {
    let head = snake.body[0];
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

// Handle direction press
function directionPressed(e) {
    const ARROW_TO_DIRECTION = {
        ArrowLeft: 'left',
        ArrowUp: 'up',
        ArrowRight: 'right',
        ArrowDown: 'down',
    };

    return ARROW_TO_DIRECTION[e.key];
}

// Generate random snake state
function randomSnakeState() {
    let newSnakeBody = [];

    // Add head
    newSnakeBody.push({
        x: Math.floor(Math.random() * (GAME_WIDTH / SQUARE_SIZE)) * SQUARE_SIZE,
        y: Math.floor(Math.random() * (GAME_HEIGHT / SQUARE_SIZE)) * SQUARE_SIZE,
    });

    const partIsOutOfLimits = (part) => part.x < 0 || part.x >= GAME_WIDTH || part.y < 0 || part.y >= GAME_HEIGHT;
    const partIsInsideSnake = (newPart) => newSnakeBody.some((part) => part.x === newPart.x && part.y === newPart.y);

    // Continue adding body
    const randomContinuedBody = (head) => {
        let newHead = {
            x: head.x,
            y: head.y,
        };
        while (partIsInsideSnake(newHead) || partIsOutOfLimits(newHead)) {
            newHead = {
                x: head.x,
                y: head.y,
            };
            switch (Math.floor(Math.random() * 4)) {
                case 0:
                    newHead.x += SQUARE_SIZE;
                    break;
                case 1:
                    newHead.x -= SQUARE_SIZE;
                    break;
                case 2:
                    newHead.y -= SQUARE_SIZE;
                    break;
                case 3:
                    newHead.y += SQUARE_SIZE;
                    break;
            }
        }

        return newHead;
    }

    const bodyLength = Math.floor(Math.random() * 10);
    for (let i = 0; i < bodyLength; i++) {
        const head = newSnakeBody[0];
        const newHead = randomContinuedBody(head);
        newSnakeBody.unshift(newHead);
    }

    return newSnakeBody;
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
    snake.body = [
        { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 },
    ];
    game = {
        score: 0,
        speed: 100,
    };

    generateFood();
    main();
}

function playTrained() {
    if (!nnIsTrained()) {
        alert('Please train first');
        return;
    }
    console.log('Bot playing...');
    startGame();
}

function train() {
    let steps = 0;
    let humanTrainSteps = [];

    const newRandomGameState = () => {
        snake.body = randomSnakeState();
        generateFood();
        drawGame();
    }

    const humanDecision = (e) => {
        if (steps > 100) {
            snake.Train(humanTrainSteps);
            return;
        }
        steps++;

        snake.nextMove = directionPressed(e);
        humanTrainSteps.push(CurrentTrainState());

        newRandomGameState();
    };

    document.addEventListener('keydown', humanDecision);
    newRandomGameState();
}

function defaultTrain() {
    console.log('Training...');
    snake.Train(DefaultTrain());
    console.log('Training completed');
}

// Add event listener
document.getElementById('train').addEventListener('click', train);
document.getElementById('playTrained').addEventListener('click', playTrained);
document.getElementById('defaultTrain').addEventListener('click', defaultTrain);