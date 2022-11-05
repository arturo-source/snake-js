const AVAILABLE_MOVES = ['up', 'down', 'left', 'right'];

var nn = new brain.NeuralNetwork({ hiddenLayers: [] });
const nnIsTrained = () => nn.outputLayer !== -1;

function DefaultTrain() {
    const TOTAL_CELLS = GAME_HEIGHT / SQUARE_SIZE * GAME_WIDTH / SQUARE_SIZE;
    const emptyState = {
        diffX: 0,
        diffY: 0,
        up: 0,
        down: 0,
        left: 0,
        right: 0,
    };

    let steps = [
        { input: { ...emptyState }, output: { up: 1, down: 0, left: 0, right: 0 } },
        { input: { ...emptyState }, output: { up: 0, down: 1, left: 0, right: 0 } },
        { input: { ...emptyState }, output: { up: 0, down: 0, left: 1, right: 0 } },
        { input: { ...emptyState }, output: { up: 0, down: 0, left: 0, right: 1 } }
    ];

    // add snake in center and food in top 
    steps[0].input.diffX = 0;
    steps[0].input.diffY = -SQUARE_SIZE / GAME_HEIGHT;

    // add snake in center and food in bottom
    steps[1].input.diffX = 0;
    steps[1].input.diffY = SQUARE_SIZE / GAME_HEIGHT;

    // add snake in center and food in left
    steps[2].input.diffX = -SQUARE_SIZE / GAME_WIDTH;
    steps[2].input.diffY = 0;

    // add snake in center and food in right
    steps[3].input.diffX = SQUARE_SIZE / GAME_WIDTH;
    steps[3].input.diffY = 0;

    return steps;
}

function CurrentGameState() {
    return {
        diffX: (food.x - snake.body[0].x) / GAME_WIDTH,
        diffY: (food.y - snake.body[0].y) / GAME_HEIGHT,
        up: Number(snake.body.some(part => part.x === snake.body[0].x && part.y === snake.body[0].y - SQUARE_SIZE)),
        down: Number(snake.body.some(part => part.x === snake.body[0].x && part.y === snake.body[0].y + SQUARE_SIZE)),
        left: Number(snake.body.some(part => part.x === snake.body[0].x - SQUARE_SIZE && part.y === snake.body[0].y)),
        right: Number(snake.body.some(part => part.x === snake.body[0].x + SQUARE_SIZE && part.y === snake.body[0].y)),
    };
}

function CurrentTrainState() {
    const cells = CurrentGameState();
    const output = { up: 0, down: 0, left: 0, right: 0 };
    AVAILABLE_MOVES.forEach(move => {
        if (move === snake.nextMove) output[move] = 1;
    });

    return { input: cells, output: output };
}


snake.Train = (steps) => {
    nn.train(steps, {
        // iterations: 100000,
        // errorThresh: 0.0001,
        log: err => console.log(err),
    });
}

snake.Run = () => {
    const getKeyFromBiggest = (obj) =>
        Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b);
    const thereIsValidMove = (obj) => Object.values(obj).some(value => value > 0.5)

    const currentState = CurrentGameState();
    const result = nn.run(currentState);
    console.log(result);

    if (thereIsValidMove(result)) {
        return getKeyFromBiggest(result);
    }
}
