const AVAILABLE_MOVES = {
    up: 0,
    down: 1,
    left: 2,
    right: 3,
}

const AVAILABLE_STATES = {
    empty: 0,
    food: 1,
    snake: 2,
}

var nn = new brain.NeuralNetwork();

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
    steps[0].input[TOTAL_CELL_COUNT / 2] = AVAILABLE_STATES.snake;
    steps[0].input[TOTAL_CELL_COUNT / 2 - CELLS_WIDTH] = AVAILABLE_STATES.food;

    // add snake in center and food in bottom
    steps[1].input[TOTAL_CELL_COUNT / 2] = AVAILABLE_STATES.snake;
    steps[1].input[TOTAL_CELL_COUNT / 2 + CELLS_WIDTH] = AVAILABLE_STATES.food;

    // add snake in center and food in left
    steps[2].input[TOTAL_CELL_COUNT / 2] = AVAILABLE_STATES.snake;
    steps[2].input[TOTAL_CELL_COUNT / 2 - 1] = AVAILABLE_STATES.food;

    // add snake in center and food in right
    steps[3].input[TOTAL_CELL_COUNT / 2] = AVAILABLE_STATES.snake;
    steps[3].input[TOTAL_CELL_COUNT / 2 + 1] = AVAILABLE_STATES.food;

    return steps;
}

function MapTheCells() {
    const isFood = (x, y) => food.x === x && food.y === y;
    const isSnake = (x, y) => snake.body.some(part => part.x === x && part.y === y);

    let cells = [];
    for (let i = 0; i < GAME_WIDTH; i += SQUARE_SIZE) {
        for (let j = 0; j < GAME_HEIGHT; j += SQUARE_SIZE) {
            if (isFood(i, j)) cells.push(AVAILABLE_STATES.food);
            else if (isSnake(i, j)) cells.push(AVAILABLE_STATES.snake);
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
    nn.train(steps, {
        log: (err) => console.log({ err }),
    });
}

snake.Run = () => {
    const getKeyByValue = (obj, val) =>
        Object.keys(obj).find(key => obj[key] === val);

    const currentState = MapTheCells();
    const result = nn.run(currentState);
    const resultMove = Math.round(result.move);

    return getKeyByValue(AVAILABLE_MOVES, resultMove);
}
