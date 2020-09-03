const Discord = require("discord.js");
const math = require("mathjs");

const bot = new Discord.Client();
const prefix = 'simp';

var playing = false;
var player;
var board = [
    ['_','_','_'],
    ['_','_','_'],
    ['_','_','_'],
];
let scores = {
    'X' : -10,
    'O' : 10,
    'tie' : 0
};

bot.on('message', message => {

    //Stops commands from working on bot's responses
    if (message.author.bot) {
        return
    }

    //tic tac toe
    if (playing && message.author === player) {

        if (message.content == 'end') {
            return playing = false;
        }
         
        let pChoice = getChoice(message.content);

        try {
            if (board[pChoice[0]][pChoice[1]] !== '_') throw "not a spot";
        } catch(err) {
            console.log('error');
            return message.channel.send('Not a valid spot, try again.');
        }

        board[pChoice[0]][pChoice[1]] = 'X';

        if (!checkWin()) {
            let cChoice = bestMove();
            board[cChoice[0]][cChoice[1]] = 'O';
            printBoard(message.channel, "Your move");
        } else {
            printBoard(message.channel, `**Winner**: ${checkWin()}`);
            playing = false;
        }
    }

    //User Commands
    if (message.content.startsWith(prefix)) {
        var command = message.content.slice(prefix.length + 1).toLowerCase();
        
        if (command == 'tic tac toe') {
            playing = true, player = message.author;
            clearBoard();
            printBoard(message.channel, "**Lets Play:** pick a row and column using numbers 1, 2 and 3 to play a spot, for example '3, 1' to play in the bottom left spot. Type 'end' to stop.");
        } else {
            message.channel.send('Not a command');
        }
    }
});

//Tic Tac Toe Code
function checkWin() {
    let cha;
    
    for (let a = 0; a < 2; a++) {
      if (a == 0) {
        cha = 'X';
      } else {
        cha = 'O';
      }
      
      //check rows and columns
      for (let i = 0; i < 3; i++) {
        if (board[i][0] == cha && board[i][1] == cha && board[i][2] == cha) {
          return cha.toString();
        } else if (board[0][i] == cha && board[1][i] == cha && board[2][i] == cha) {
          return cha.toString();
        }
      }
      
      //check diagnols
      if (board[0][0] == cha && board[1][1] == cha && board[2][2] == cha) {
        return cha.toString();
      } else if (board[2][0] == cha && board[1][1] == cha && board[0][2] == cha) {
        return cha.toString();
      }
    }
      
    
    //check for tie
    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '_') {
          openSpots++;
        }
      }
    }
    
    if (openSpots == 0) {
      return 'tie';
    }
    
    return false;
}

function bestMove() {
  let bestScore = -Infinity;
  let bestSpot;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      
      if (board[i][j] == '_') {
        board[i][j] = 'O';
        let score = minimax(board, 0, false);
        board[i][j] = '_';
        
        if (score > bestScore) {
          bestScore = score;
          bestSpot = { i, j };
        }
      }
    }
  }
  return [bestSpot.i, bestSpot.j]
}

function minimax(board, depth, isMaximizing) {
  let result = checkWin();
  
  //check if terminal state
  if (result != false) {
    return scores[result];
  }
  
  if (isMaximizing) {
    let bestScore = -Infinity;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '_') {
          board[i][j] = 'O';
          let score = minimax(board, depth + 1, false);
          board[i][j] = '_';
          bestScore = math.max(bestScore, score);
        }
      }
    }
    return bestScore;
    
  } else {
    let bestScore = Infinity;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '_') {
          board[i][j] = 'X';
          let score = minimax(board, depth + 1, true);
          board[i][j] = '_';
          bestScore = math.min(bestScore, score);
        }
      }
    }
    return bestScore;
  }
}

function clearBoard() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board[i][j] = '_';
        }
    }
}

function printBoard(channel, ...messages) {
  let text = `${board[0][0]} ${board[0][1]} ${board[0][2]}\n
              ${board[1][0]} ${board[1][1]} ${board[1][2]}\n
              ${board[2][0]} ${board[2][1]} ${board[2][2]}`;
  
  channel.send(messages[0]);
  channel.send(text.replace(/  /g, ''), {code: 'md'});
  //channel.send(messages[1]);
}

function getChoice(message) {
  var input = message.replace(/[^\d]/g, '').split('');
  pChoice = input.map(function(num) { return math.subtract(num, 1) });
  return pChoice;
}

bot.login("NzQyNjI4NTQ5Mzk5MjgxNzM0.XzI4uw.iPL_7TgZdcpmLsfbbOHy7-bMeOU");
