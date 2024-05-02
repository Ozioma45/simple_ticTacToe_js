//displayController-This handles the displaying of messages
const displayController = (()=>{
    const renderMessage = (message) => {
        document.querySelector("#message").innerHTML = message;
    }
    return {
        renderMessage,
    }
})();


//Gameboard - it takes care of the logic of rendering the game, updating the gameboard and exposing the board but no allowing people access it directly
const Gameboard = (() => {
    let gameboard = ["", "", "", "", "", "", "", "", ""];

    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) => {
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`;
        });

        document.querySelector("#gameboard").innerHTML = boardHTML;

        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick);
        });

    };

    const update = (index, value) => {
        gameboard[index] = value;
        render();
    }

    const getGameboard = () => gameboard;

    return {
        render,
        update,
        getGameboard
    };
})();

//createPlayer - A factory that creates as many players as we need
const createPlayer = (name, mark) => {
    return {
        name,
        mark,
    };
};

//Game - it helps us to start the game, handleclicks and also to restart the game
const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "0"),
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
    };

    const handleClick = (event) => {
        if (gameOver){
            return;
        }

        let index = parseInt(event.target.id.split("-")[1]);

        if(Gameboard.getGameboard()[index] != ""){
        return
        };

        Gameboard.update(index, players[currentPlayerIndex].mark);

        if (checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)){
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex].name} wins!`)
        }else if (checkForTie(Gameboard.getGameboard())){
            gameOver=true;
            displayController.renderMessage(" Its a Tie")
        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };

    const restart = () => {
        for (let i = 0; i<9;i++){
            Gameboard.update(i,"")
        }

        Gameboard.render();

        document.querySelector("#message").innerHTML=""
        gameOver = false;
    }

    return {
        start,
        handleClick,
        restart
    };
})();

//checkForWin- logic that check if someone win
    function checkForWin(board){
        const winningCombinations = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ]

        for (let i = 0; i < winningCombinations.length; i++){
            const [a,b,c] = winningCombinations[i];
            if (board[a] && board[a]===board[b] && board[a]===board[c]){
                return true;
            }
        }

        return false;
    }

    //checkForTie- logic that check if its a tie
    function checkForTie(board){
        return board.every(cell => cell !== "")
    } 

const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", () => {
    Game.restart();
})

const startButton = document.querySelector("#start-button");

startButton.addEventListener("click", () => {
    Game.start();
});
