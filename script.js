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

const gameController = (function() {
    const startGame = () => {
        gameBoard.resetBoard();
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

    const getUserTurn = () => {
        const currentPlayer = getCurrentTurn();
        console.log(`It's ${currentPlayer.name}'s turn`);
        coordinates = prompt('Enter the x and y position separated by a comma');
        coordinates = coordinates.split(',');
        if (gameBoard.getBoard()[coordinates[0]][coordinates[1]] === '') {
            gameBoard.setBoard(coordinates[0], coordinates[1], currentPlayer.mark);}
        else {
            console.log('Invalid move. Try again');
            getUserTurn();
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
    return { startGame, getCurrentTurn, getUserTurn, gameEndController }
})();

const game = (function() {
    gameController.startGame();

    while (!gameController.gameEndController().checkWinner(gameBoard.getBoard()) && !gameController.gameEndController().checkDraw(gameBoard.getBoard())) {
        const currentPlayer = gameController.getCurrentTurn();
        (function() {gameController.getUserTurn();})();
        console.log(gameBoard.getBoard());
        if (gameController.gameEndController().checkWinner(gameBoard.getBoard())) {
            console.log(`${currentPlayer.name} wins!`);
            break;
        }
    }
})();