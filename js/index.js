var board;
const humanPlayer = 'O';
const computerPlayer = 'X';
const sound1 = new Audio('https://raw.githubusercontent.com/Eiqko/tictac/master/js/go.mp3'); 
const sound2 = new Audio('https://raw.githubusercontent.com/Eiqko/tictac/master/js/win.mp3'); 
const sound1 = new Audio('../js/go.mp3'); 
const sound2 = new Audio('../js/win.mp3'); 
const winingCombos = [
    [0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGaym();

//restart the game
function startGaym(){
    document.querySelector('.endgamenya').style.display = 'none';
    board = Array.from(Array(9).keys());
    for(var i = 0; i < cells.length; i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', nextTurn, false);
    }
}

//nexx turn function human and computer
function nextTurn(square){
   if(typeof board[square.target.id] == 'number'){
      turn(square.target.id, humanPlayer)
      if (!checkWinner(board, humanPlayer) && !checkTie()) turn(spotTerbaik(), computerPlayer)
   }
}

function turn(squareId, player){
    board[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWinner(board, player)
    if(gameWon) gameOver(gameWon)
 }

function checkWinner(boardd, player) {
   let play = boardd.reduce((a, e, i) =>
       (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for(let [index, win] of winingCombos.entries()){
        if(win.every(el => play.indexOf(el) > -1 )){
            gameWon = {index: index, player: player};
            break;
        }
    }   
    return gameWon;  
}


//if the winningcombination is true then you can win or lose..but mostly lose hehe
function gameOver(gameWon){
    for(let index of winingCombos[gameWon.index]){
       document.getElementById(index).style.backgroundColor = gameWon.player == humanPlayer ? 'rgba(43, 139, 230, 0.8)'  : 'rgba(252, 128, 112, 0.8)';
    } 
    for(let index of winingCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = gameWon.player == humanPlayer ? sound2.play() :  sound1.play();
     }
    for(var i = 0; i < cells.length; i++){
         cells[i].removeEventListener('click', nextTurn, false);
    }
    declareWinner(gameWon.player == humanPlayer ? 'You Win Bro!' : 'You lose...');
}

//make ui if u are win lsoe or tie, connect to endgamenya html+css
function declareWinner(who){
   document.querySelector('.endgamenya').style.display = 'block';
   document.querySelector('.endgamenya .text').innerText = who;
}

function emptySquare(){
    return board.filter(s => typeof s == 'number')
}

function spotTerbaik(){
    return minimax(board, computerPlayer).index;
}


//for to make it draw/tie
function checkTie(){
    if(emptySquare().length == 0){
        for(var i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = 'rgba(43, 230, 152, 0.8)';
            cells[i].removeEventListener('click', nextTurn, false);
        }
        declareWinner('Draw Game!!')
        return true;
    }
    return false;
}

function minimax(newBoard, player){
   var spotAvail = emptySquare();

   if(checkWinner(newBoard, humanPlayer)){
       return {score: -10};
    //uncomment to make it easy   
//   }else if(checkWinner(newBoard, computerPlayer)){   
//         return {score: -10};
   }else if(checkWinner(newBoard, computerPlayer)){
       return {score: 10};
   }else if(spotAvail.length === 0){
       return {score: 0};
   }
   var moves = [];
   for(var i = 0; i < spotAvail.length; i++){
      var move = {};
      move.index = newBoard[spotAvail[i]];
      newBoard[spotAvail[i]] = player;

      if(player == computerPlayer){
         var result = minimax(newBoard, humanPlayer);
         move.score = result.score;
      }else{
          var result = minimax(newBoard, computerPlayer);
          move.score = result.score;
      }

      newBoard[spotAvail[i]] = move.index;

      moves.push(move);
   }

   var bestMove;
   if(player === computerPlayer){
       var bestScore = -10000;
       for(var i = 0; i < moves.length; i++){
             if(moves[i].score > bestScore){
                 bestScore = moves[i].score;
                 bestMove = i;
             }
       }
   }else{
       var bestScore = 10000;
       for(var i = 0; i < moves.length; i++){
         if(moves[i].score < bestScore){
             bestScore = moves[i].score;
             bestMove = i;
         }
       }
   }
   return moves[bestMove];
}
