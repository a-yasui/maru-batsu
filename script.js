let gridSize = 3;
let cells = [];
let gameBoard = [];
let currentPlayer = 'X';
let gameActive = false;

const gameBoardElement = document.getElementById('game-board');
const gameStatus = document.querySelector('.game-status');
const restartBtn = document.querySelector('.restart-btn');
const startBtn = document.querySelector('.start-btn');
const gridSizeSelect = document.getElementById('grid-size');

const winningMessage = () => `プレイヤー ${currentPlayer === 'X' ? '✕' : '〇'} の勝ち！`;
const drawMessage = () => `引き分け！`;
const currentPlayerTurn = () => `プレイヤー ${currentPlayer === 'X' ? '✕' : '〇'} の番`;

function initializeGame() {
    gridSize = parseInt(gridSizeSelect.value);
    gameBoard = Array(gridSize * gridSize).fill('');
    gameActive = true;
    currentPlayer = 'X';
    
    createBoard();
    gameStatus.innerHTML = currentPlayerTurn();
}

function createBoard() {
    gameBoardElement.innerHTML = '';
    gameBoardElement.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gameBoardElement.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    
    const cellSize = Math.min(
        (window.innerWidth * 0.8) / gridSize,
        (window.innerHeight * 0.6) / gridSize,
        80
    );
    
    gameBoardElement.style.width = `${cellSize * gridSize + (gridSize - 1) * 3 + 6}px`;
    gameBoardElement.style.height = `${cellSize * gridSize + (gridSize - 1) * 3 + 6}px`;
    
    cells = [];
    
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.style.fontSize = `${cellSize * 0.4}px`;
        cell.addEventListener('click', handleCellClick);
        gameBoardElement.appendChild(cell);
        cells.push(cell);
    }
}

function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameBoard[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer === 'X' ? '✕' : '〇';
    clickedCell.classList.add(currentPlayer.toLowerCase());
}

function handleResultValidation() {
    let roundWon = false;
    
    // 横のチェック
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col <= gridSize - 5; col++) {
            const startIdx = row * gridSize + col;
            if (checkLine(startIdx, 1, 5)) {
                roundWon = true;
                break;
            }
        }
        if (roundWon) break;
    }
    
    // 縦のチェック
    if (!roundWon) {
        for (let col = 0; col < gridSize; col++) {
            for (let row = 0; row <= gridSize - 5; row++) {
                const startIdx = row * gridSize + col;
                if (checkLine(startIdx, gridSize, 5)) {
                    roundWon = true;
                    break;
                }
            }
            if (roundWon) break;
        }
    }
    
    // 斜め（左上から右下）のチェック
    if (!roundWon) {
        for (let row = 0; row <= gridSize - 5; row++) {
            for (let col = 0; col <= gridSize - 5; col++) {
                const startIdx = row * gridSize + col;
                if (checkLine(startIdx, gridSize + 1, 5)) {
                    roundWon = true;
                    break;
                }
            }
            if (roundWon) break;
        }
    }
    
    // 斜め（右上から左下）のチェック
    if (!roundWon) {
        for (let row = 0; row <= gridSize - 5; row++) {
            for (let col = 4; col < gridSize; col++) {
                const startIdx = row * gridSize + col;
                if (checkLine(startIdx, gridSize - 1, 5)) {
                    roundWon = true;
                    break;
                }
            }
            if (roundWon) break;
        }
    }

    if (roundWon) {
        gameStatus.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    let roundDraw = !gameBoard.includes('');
    if (roundDraw) {
        gameStatus.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function checkLine(startIdx, step, length) {
    const player = gameBoard[startIdx];
    if (player === '') return false;
    
    for (let i = 1; i < length; i++) {
        if (gameBoard[startIdx + i * step] !== player) {
            return false;
        }
    }
    return true;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatus.innerHTML = currentPlayerTurn();
}

function handleRestartGame() {
    if (!gameActive && cells.length > 0) {
        gameActive = true;
        currentPlayer = 'X';
        gameBoard = Array(gridSize * gridSize).fill('');
        gameStatus.innerHTML = currentPlayerTurn();
        
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('x', 'o');
        });
    }
}

startBtn.addEventListener('click', initializeGame);
restartBtn.addEventListener('click', handleRestartGame);

// ウィンドウサイズ変更時の対応
window.addEventListener('resize', () => {
    if (gameActive || cells.length > 0) {
        createBoard();
        // ゲームボードの状態を復元
        gameBoard.forEach((value, index) => {
            if (value !== '') {
                cells[index].innerHTML = value === 'X' ? '✕' : '〇';
                cells[index].classList.add(value.toLowerCase());
            }
        });
    }
});