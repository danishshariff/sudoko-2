
document.addEventListener('DOMContentLoaded', () => {
    const emptyBoard = Array(9).fill(null).map(() => Array(9).fill(0));
    let board = JSON.parse(JSON.stringify(emptyBoard));
    const sudokuBoard = document.getElementById('sudoku-board');
    let selectedCell = null;

    function createBoard() {
        sudokuBoard.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => selectCell(cell));
                sudokuBoard.appendChild(cell);
            }
        }
    }

    function selectCell(cell) {
        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        selectedCell = cell;
        cell.classList.add('selected');
    }

    document.getElementById('number-inputs').addEventListener('click', (e) => {
        if (!selectedCell || !e.target.classList.contains('number')) return;
        const number = e.target.textContent;
        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);
        if (number === 'X') {
            board[row][col] = 0;
            selectedCell.textContent = '';
        } else {
            board[row][col] = parseInt(number);
            selectedCell.textContent = number;
        }
    });

    document.getElementById('solve').addEventListener('click', () => {
        const copiedBoard = JSON.parse(JSON.stringify(board)); 
        if (solveSudoku(copiedBoard)) {
            board = copiedBoard;
            fillBoard();
        } else {
            alert('No solution exists!');
        }
    });

    document.getElementById('reset').addEventListener('click', () => {
        board = JSON.parse(JSON.stringify(emptyBoard)); 
        createBoard();
    });

    function fillBoard() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
                if (board[i][j] !== 0) {
                    cell.textContent = board[i][j];
                } else {
                    cell.textContent = '';
                }
            }
        }
    }

    function isValid(board, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num || board[x][col] === num) {
                return false;
            }
            const boxRow = 3 * Math.floor(row / 3) + Math.floor(x / 3);
            const boxCol = 3 * Math.floor(col / 3) + (x % 3);
            if (board[boxRow][boxCol] === num) {
                return false;
            }
        }
        return true;
    }

    function solveSudoku(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (solveSudoku(board)) {
                                return true;
                            }
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    createBoard();
});
