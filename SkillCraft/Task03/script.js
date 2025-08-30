document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const gameStatus = document.getElementById('gameStatus');
    const restartButton = document.getElementById('restartButton');
    const playerVsPlayerBtn = document.getElementById('playerVsPlayer');
    const playerVsComputerBtn = document.getElementById('playerVsComputer');
    const gameBoard = document.getElementById('gameBoard');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = false;
    let gameMode = null; // 'playerVsPlayer' or 'playerVsComputer'

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const messages = {
        playerTurn: (player) => `It's ${player}'s turn`,
        win: (player) => `Player ${player} has won!`,
        draw: 'Game ended in a draw!'
    };

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        board[clickedCellIndex] = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        clickedCell.innerHTML = currentPlayer;
    }

    function handlePlayerChange() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        gameStatus.innerHTML = messages.playerTurn(currentPlayer);
    }

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = board[winCondition[0]];
            let b = board[winCondition[1]];
            let c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            gameStatus.innerHTML = messages.win(currentPlayer);
            isGameActive = false;
            return;
        }

        let roundDraw = !board.includes('');
        if (roundDraw) {
            gameStatus.innerHTML = messages.draw;
            isGameActive = false;
            return;
        }

        handlePlayerChange();
    }

    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        if (board[clickedCellIndex] !== '' || !isGameActive) {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();

        if (isGameActive && gameMode === 'playerVsComputer' && currentPlayer === 'O') {
            setTimeout(handleComputerMove, 500);
        }
    }

    function handleComputerMove() {
        let availableCells = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                availableCells.push(i);
            }
        }

        if (availableCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableCells.length);
            const computerMoveIndex = availableCells[randomIndex];
            const computerCell = document.querySelector(`[data-cell-index="${computerMoveIndex}"]`);

            handleCellPlayed(computerCell, computerMoveIndex);
            handleResultValidation();
        }
    }

    function startGame(mode) {
        gameMode = mode;
        isGameActive = true;
        currentPlayer = 'X';
        board = ['', '', '', '', '', '', '', '', ''];
        gameStatus.innerHTML = messages.playerTurn(currentPlayer);
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('x', 'o');
        });
        gameBoard.style.display = 'grid'; // Show game board
    }

    function handleRestartGame() {
        startGame(gameMode);
    }

    playerVsPlayerBtn.addEventListener('click', () => startGame('playerVsPlayer'));
    playerVsComputerBtn.addEventListener('click', () => startGame('playerVsComputer'));
    restartButton.addEventListener('click', handleRestartGame);
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));

    // Initially hide the game board until a mode is selected
    gameBoard.style.display = 'none';
    gameStatus.innerHTML = 'Choose a game mode to start!';
});
