const AVAILABLE_MOVES = ['up', 'down', 'left', 'right'];

var nn = new brain.NeuralNetwork({ hiddenLayers: [] });
const nnIsTrained = () => nn.outputLayer !== -1;

function DefaultTrain() {
    const TOTAL_CELLS = GAME_HEIGHT / SQUARE_SIZE * GAME_WIDTH / SQUARE_SIZE;
    const emptyState = Array(TOTAL_CELLS * 2).fill(0);

    let steps = [
        { input: emptyState.slice(), output: { up: 1, down: 0, left: 0, right: 0 } },
        { input: emptyState.slice(), output: { up: 0, down: 1, left: 0, right: 0 } },
        { input: emptyState.slice(), output: { up: 0, down: 0, left: 1, right: 0 } },
        { input: emptyState.slice(), output: { up: 0, down: 0, left: 0, right: 1 } }
    ];

    // add snake in center and food in top 
    steps[0].input[0] = GAME_WIDTH / 2;
    steps[0].input[1] = GAME_HEIGHT / 2;
    steps[0].input.push(GAME_WIDTH / 2);
    steps[0].input.push(GAME_HEIGHT / 2 - SQUARE_SIZE);

    // add snake in center and food in bottom
    steps[1].input[0] = GAME_WIDTH / 2;
    steps[1].input[1] = GAME_HEIGHT / 2;
    steps[1].input.push(GAME_WIDTH / 2);
    steps[1].input.push(GAME_HEIGHT / 2 + SQUARE_SIZE);

    // add snake in center and food in left
    steps[2].input[0] = GAME_WIDTH / 2;
    steps[2].input[1] = GAME_HEIGHT / 2;
    steps[2].input.push(GAME_WIDTH / 2 - SQUARE_SIZE);
    steps[2].input.push(GAME_HEIGHT / 2);

    // add snake in center and food in right
    steps[3].input[0] = GAME_WIDTH / 2;
    steps[3].input[1] = GAME_HEIGHT / 2;
    steps[3].input.push(GAME_WIDTH / 2 + SQUARE_SIZE);
    steps[3].input.push(GAME_HEIGHT / 2);

    return steps;
}

function CurrentGameState() {
    const TOTAL_CELLS = GAME_HEIGHT / SQUARE_SIZE * GAME_WIDTH / SQUARE_SIZE;
    const state = Array(TOTAL_CELLS * 2).fill(0);
    for (const i in snake.body) {
        const part = snake.body[i];
        state[i * 2] = part.x;
        state[i * 2 + 1] = part.y;
    }

    state.push(food.x);
    state.push(food.y);

    return state;
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
    // Normalize the data
    steps = steps.map(step => {
        step.input = step.input.map(cell => cell / GAME_WIDTH);
        return step;
    });

    nn.train(steps, {
        // iterations: 1000,
        // errorThresh: 0.0001,
        log: err => console.log(err),
    });
}

snake.Run = () => {
    const getKeyFromBiggest = (obj) =>
        Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b);

    let currentState = CurrentGameState();
    // Normalize the data
    currentState = currentState.map(cell => cell / GAME_WIDTH);

    const result = nn.run(currentState);
    console.log(result);

    return getKeyFromBiggest(result);
}
