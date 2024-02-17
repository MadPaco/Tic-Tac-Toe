const player = function(name, mark) {
  return { name, mark }
}

player1 = player('Player 1', 'X');
player2 = player('Player 2', 'O');

const gameBoard = (function() {

  let board = 
    [['', '', ''],
    ['', '', ''],
    ['', '', '']];

  const getBoard = () => board;

  const setBoard = (xPosition, yPosition, mark) => board[xPosition][yPosition] = mark;

  const resetBoard = () => board = 
    [['', '', ''],
    ['', '', ''],
    ['', '', '']];

  return { getBoard, setBoard, resetBoard }
})();

const displayController = (function(){
    const renderBoard = (board) => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const coordinates = cell.id.split(',').map(Number);
            cell.textContent = board[coordinates[0]][coordinates[1]];
        });
    }

    const setResult = (result) => {
        const resultDisplay = document.querySelector('#resultDisplay');
        resultDisplay.textContent = result;
    }

    const setCurrentPlayer = (currentPlayer) => {
        const currentPlayerDisplay = document.querySelector('#turnDisplay');
        currentPlayerDisplay.textContent = `${currentPlayer.name}'s turn`;
    }


    return { renderBoard , setResult, setCurrentPlayer}
})();


const gameController = (function() {

    const stopGame = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.removeEventListener('click', handleCellClick);
        });
    }

    const handleCellClick = (e) => {
        const coordinates = e.target.id.split(',').map(Number);
        handleUserTurn(coordinates);
    }

    const startGame = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
    }
    
    const getCurrentTurn = () =>{
        let count = 0;
        for (let i = 0; i < gameBoard.getBoard().length; i++) {
            for (let j = 0; j < gameBoard.getBoard()[i].length; j++) {
                if (gameBoard.getBoard()[i][j] !== '') {
                    count++;
                }
            }
        }
        return count % 2 === 0 ? player1 : player2;
    }

    const handleUserTurn = (coordinates) => {
        const currentPlayer = getCurrentTurn();

        if (gameBoard.getBoard()[coordinates[0]][coordinates[1]] === '') {
            gameBoard.setBoard(coordinates[0], coordinates[1], currentPlayer.mark);
            displayController.renderBoard(gameBoard.getBoard());
            // Check if the game is over after each move
            if (gameEndController().checkWinner(gameBoard.getBoard())) {
                displayController.setResult(`${currentPlayer.name} wins!`);
                stopGame();

            } else if (gameEndController().checkDraw(gameBoard.getBoard())) {
                displayController.setResult('Draw!');
                stopGame();
            }
            else {
                displayController.setCurrentPlayer(getCurrentTurn());
            }
        }
        else {
            console.log('Invalid move. Try again');
        }
    }

    const gameEndController = function() {
        const checkRow = (board) => {
            for (let i = 0; i < board.length; i++) {
                if (board[i].every((mark) => mark === board[i][0] && mark !== '')) {
                    return true;
                }
            }
            return false;
        }
        
        const checkColumn = (board) => {
            for (let i = 0; i < board.length; i++) {
                if (board.every((row) => row[i] === board[0][i] && row[i] !== '')) {
                    return true;
                }
            }
            return false;
        }
        
        const checkDiagonal = (board) => {
            if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== '') {
                return true;
            }
            if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== '') {
                return true;
            }
            return false;
        }
        
        const checkDraw = (board) => {
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j] === '') {
                        return false;
                    }
                }
            }
            return true;
        }
        
        const checkWinner = (board) => {
            if (checkRow(board) || checkColumn(board) || checkDiagonal(board)) {
                return true;
            }
            return false;
        }
        
        return { checkWinner, checkDraw }

    }

    const resetGame = () => {
        gameBoard.resetBoard();
        displayController.renderBoard(gameBoard.getBoard());
        displayController.setResult('');
        displayController.setCurrentPlayer(getCurrentTurn());
        startGame();
    }

    return { startGame, getCurrentTurn, handleUserTurn, gameEndController, resetGame }
})();

const game = (function() {
    gameController.startGame();
    const resetButton = document.querySelector('#resetButton');
    resetButton.addEventListener('click', gameController.resetGame);
})();