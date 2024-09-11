const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const colors = ['#000', '#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];

const shapes = [
    [[1, 1, 1, 1]], // I
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 0], [0, 1, 1]], // Z
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1], [1, 1]], // O
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]]  // J
];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentShape = generateRandomShape();
let position = { x: Math.floor(COLS / 2) - 1, y: 0 };
let score = 0;
let level = 1;
let dropInterval = 1000;
let dropTimer = 0;

function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
                context.fillStyle = colors[board[y][x]];
                context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function drawShape() {
    context.fillStyle = colors[currentShape.color];
    for (let y = 0; y < currentShape.shape.length; y++) {
        for (let x = 0; x < currentShape.shape[y].length; x++) {
            if (currentShape.shape[y][x]) {
                context.fillRect((position.x + x) * BLOCK_SIZE, (position.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                context.strokeRect((position.x + x) * BLOCK_SIZE, (position.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function generateRandomShape() {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    return {
        shape,
        color: Math.floor(Math.random() * (colors.length - 1)) + 1
    };
}

function moveShape(dx, dy) {
    position.x += dx;
    position.y += dy;
    if (collides()) {
        position.x -= dx;
        position.y -= dy;
    }
}

function collides() {
    for (let y = 0; y < currentShape.shape.length; y++) {
        for (let x = 0; x < currentShape.shape[y].length; x++) {
            if (currentShape.shape[y][x]) {
                const boardX = position.x + x;
                const boardY = position.y + y;
                if (boardX < 0 || boardX >= COLS || boardY >= ROWS || board[boardY][boardX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function update() {
    drawBoard();
    drawShape();
    dropTimer += 100; // Increment drop timer
    if (dropTimer >= dropInterval) {
        dropTimer = 0;
        position.y++;
        if (collides()) {
            position.y--;
            placeShape();
            currentShape = generateRandomShape();
            position = { x: Math.floor(COLS / 2) - 1, y: 0 };
            if (collides()) {
                alert('Game Over!');
                board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
                score = 0;
                level = 1;
                updateUI();
            }
        }
        updateUI();
    }
}

function placeShape() {
    for (let y = 0; y < currentShape.shape.length; y++) {
        for (let x = 0; x < currentShape.shape[y].length; x++) {
            if (currentShape.shape[y][x]) {
                board[position.y + y][position.x + x] = currentShape.color;
            }
        }
    }
    clearLines();
}

function clearLines() {
    for (let y = 0; y < ROWS; y++) {
        if (board[y].every(cell => cell)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
            score += 100;
            if (score % 500 === 0) {
                level++;
                dropInterval -= 100; // Increase speed
            }
        }
    }
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
}

function handleKeydown(event) {
    switch (event.key) {
        case 'ArrowLeft':
            moveShape(-1, 0);
            break;
        case 'ArrowRight':
            moveShape(1, 0);
            break;
        case 'ArrowDown':
            moveShape(0, 1);
            break;
        case 'ArrowUp':
            // Rotate shape
            break;
    }
}

document.addEventListener('keydown', handleKeydown);

setInterval(update, 100); // Adjust interval for game speed
