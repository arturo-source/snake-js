const AVAILABLE_MOVES = ['up', 'down', 'left', 'right'];

var nn = new brain.NeuralNetwork({ hiddenLayers: [] });
const nnIsTrained = () => nn.outputLayer !== -1;

function DefaultTrain() {
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
    const getKeysSortedByValue = (obj) =>
        Object.keys(obj).sort((a, b) => obj[b] - obj[a]);
    const isValidMove = (move) => {
        const head = snake.body[0];
        switch (move) {
            case 'right':
                const nextX = head.x + SQUARE_SIZE;
                return nextX < GAME_WIDTH && !snake.body.some(part => part.x === nextX && part.y === head.y);
            case 'left':
                const prevX = head.x - SQUARE_SIZE;
                return prevX >= 0 && !snake.body.some(part => part.x === prevX && part.y === head.y);
            case 'up':
                const prevY = head.y - SQUARE_SIZE;
                return prevY >= 0 && !snake.body.some(part => part.x === head.x && part.y === prevY);
            case 'down':
                const nextY = head.y + SQUARE_SIZE;
                return nextY < GAME_HEIGHT && !snake.body.some(part => part.x === head.x && part.y === nextY);
        }
    }

    const currentState = CurrentGameState();
    const result = nn.run(currentState);

    const sortedMoves = getKeysSortedByValue(result);
    const nextMove = sortedMoves.find(move => isValidMove(move));
    return nextMove;
}
