const AVAILABLE_MOVES = {
    up: 0,
    down: 1,
    left: 2,
    right: 3,
}

const AVAILABLE_STATES = {
    empty: 0,
    food: 1,
    snakeHead: 2,
    snakeBody: 3,
}

const MOVES_MAX = Math.max(...Object.keys(AVAILABLE_MOVES).map((k, v) => v));
const STATES_MAX = Math.max(...Object.keys(AVAILABLE_STATES).map((k, v) => v));

var nn = new brain.NeuralNetwork({ hiddenLayers: [] });
const nnIsTrained = () => nn.outputLayer !== -1;

function DefaultTrain() {
    const TOTAL_CELL_COUNT = (GAME_WIDTH / SQUARE_SIZE) * (GAME_HEIGHT / SQUARE_SIZE);
    const CELLS_WIDTH = GAME_WIDTH / SQUARE_SIZE;

    let emptyCells = [];
    for (let i = 0; i < GAME_WIDTH; i += SQUARE_SIZE) {
        for (let j = 0; j < GAME_HEIGHT; j += SQUARE_SIZE) {
            emptyCells.push(AVAILABLE_STATES.empty);
        }
    }

    let steps = [
        { input: emptyCells.slice(), output: { move: AVAILABLE_MOVES.up } },
        { input: emptyCells.slice(), output: { move: AVAILABLE_MOVES.down } },
        { input: emptyCells.slice(), output: { move: AVAILABLE_MOVES.left } },
        { input: emptyCells.slice(), output: { move: AVAILABLE_MOVES.right } }
    ];

    // add snake in center and food in top 
    steps[0].input[TOTAL_CELL_COUNT / 2] = AVAILABLE_STATES.snakeHead;
    steps[0].input[TOTAL_CELL_COUNT / 2 - CELLS_WIDTH] = AVAILABLE_STATES.food;

    // add snake in center and food in bottom
    steps[1].input[TOTAL_CELL_COUNT / 2] = AVAILABLE_STATES.snakeHead;
    steps[1].input[TOTAL_CELL_COUNT / 2 + CELLS_WIDTH] = AVAILABLE_STATES.food;

    // add snake in center and food in left
    steps[2].input[TOTAL_CELL_COUNT / 2] = AVAILABLE_STATES.snakeHead;
    steps[2].input[TOTAL_CELL_COUNT / 2 - 1] = AVAILABLE_STATES.food;

    // add snake in center and food in right
    steps[3].input[TOTAL_CELL_COUNT / 2] = AVAILABLE_STATES.snakeHead;
    steps[3].input[TOTAL_CELL_COUNT / 2 + 1] = AVAILABLE_STATES.food;

    return steps;
}

function MapTheCells() {
    const isFood = (x, y) => food.x === x && food.y === y;
    const isSnakeHead = (x, y) => snake.body[0].x === x && snake.body[0].y === y;
    const isSnakeBody = (x, y) => snake.body.slice(1).some(part => part.x === x && part.y === y);

    let cells = [];
    for (let i = 0; i < GAME_WIDTH; i += SQUARE_SIZE) {
        for (let j = 0; j < GAME_HEIGHT; j += SQUARE_SIZE) {
            if (isFood(i, j)) cells.push(AVAILABLE_STATES.food);
            else if (isSnakeHead(i, j)) cells.push(AVAILABLE_STATES.snakeHead);
            else if (isSnakeBody(i, j)) cells.push(AVAILABLE_STATES.snakeBody);
            else cells.push(AVAILABLE_STATES.empty);
        }
    }

    return cells;
}

function CurrentTrainState() {
    const cells = MapTheCells();

    return { input: cells, output: { move: AVAILABLE_MOVES[snake.nextMove] } };
}


snake.Train = (steps) => {
    // Normalize the data
    steps = steps.map(step => {
        step.input = step.input.map(cell => cell / STATES_MAX);
        step.output.move /= MOVES_MAX;
        return step;
    });

    nn.train(steps, {
        // iterations: 1000,
        // errorThresh: 0.01,
        log: err => console.log(err),
    });
}

snake.Run = () => {
    const getKeyByValue = (obj, val) =>
        Object.keys(obj).find(key => obj[key] === val);

    let currentState = MapTheCells();
    // Normalize the data
    currentState = currentState.map(cell => cell / STATES_MAX);

    const result = nn.run(currentState);
    const resultMove = Math.round(result.move * MOVES_MAX);
    console.log(resultMove);

    return getKeyByValue(AVAILABLE_MOVES, resultMove);
}