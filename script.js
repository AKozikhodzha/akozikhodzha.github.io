const board = document.getElementById('game-board');
const status = document.getElementById('status');
const restartButton = document.getElementById('restart');
const gameArea = document.getElementById('game-area');
const winningLine = document.getElementById('winning-line');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];

// Выигрышные комбинации
const winningConditions = [
    [0, 1, 2], // Верхний ряд
    [3, 4, 5], // Средний ряд
    [6, 7, 8], // Нижний ряд
    [0, 3, 6], // Левый столбец
    [1, 4, 7], // Средний столбец
    [2, 5, 8], // Правый столбец
    [0, 4, 8], // Диагональ слева направо
    [2, 4, 6], // Диагональ справа налево
];

// Создание игрового поля
function createBoard() {
    board.innerHTML = '';
    gameState.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        cellElement.addEventListener('click', handleCellClick);
        board.appendChild(cellElement);
    });
}

// Обработка клика по ячейке
function handleCellClick(event) {
    const clickedCell = event.target;
    const cellIndex = clickedCell.dataset.index;

    if (gameState[cellIndex] !== '' || !gameActive) return;

    gameState[cellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add('taken');

    if (checkWin()) {
        status.textContent = `Игрок ${currentPlayer} выиграл!`;
        gameActive = false;
        return;
    }

    if (gameState.every(cell => cell !== '')) {
        status.textContent = 'Ничья!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Ходит игрок ${currentPlayer}`;
}

// Проверка на выигрыш
function checkWin() {
    for (let i = 0; i < winningConditions.length; i++) {
        const condition = winningConditions[i];
        if (condition.every(index => gameState[index] === currentPlayer)) {
            drawWinningLine(i);
            return true;
        }
    }
    return false;
}

// Отображение линии победы
function drawWinningLine(index) {
    const startCell = document.querySelector(`.cell:nth-child(${winningConditions[index][0] + 1})`);
    const endCell = document.querySelector(`.cell:nth-child(${winningConditions[index][2] + 1})`);

    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
    const areaRect = gameArea.getBoundingClientRect(); // Ограничиваем область до игрового поля

    const x1 = startRect.left - areaRect.left + startRect.width / 2;
    const y1 = startRect.top - areaRect.top + startRect.height / 2;
    const x2 = endRect.left - areaRect.left + endRect.width / 2;
    const y2 = endRect.top - areaRect.top + endRect.height / 2;

    const length = Math.hypot(x2 - x1, y2 - y1); // Длина линии
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI); // Угол поворота

    winningLine.style.width = `${length}px`;
    winningLine.style.transform = `translate(${x1}px, ${y1}px) rotate(${angle}deg) scaleX(1)`;
}

// Сброс линии победы
function resetWinningLine() {
    winningLine.style.transform = 'scaleX(0)';
    winningLine.style.width = '0';
}

// Сброс игры
restartButton.addEventListener('click', () => {
    resetWinningLine();
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    status.textContent = `Ходит игрок ${currentPlayer}`;
    createBoard();
});

// Инициализация игры
createBoard();
status.textContent = `Ходит игрок ${currentPlayer}`;
