console.log('GuessingGame.js is connected');

function generateWinningNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function shuffle(array) {
  var m = array.length;
  var randomNum;
  var temp;

  while (m) {
    randomNum = Math.floor(Math.random() * m--);

    temp = array[m];
    array[m] = array[randomNum];
    array[randomNum] = temp;
  }
  return array;
}

function newGame() {
  return new Game();
}

// GAME CLASS

function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();

}

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
  if (this.playersGuess < this.winningNumber) {
    return true;
  } else {
    return false;
  }
};

Game.prototype.playersGuessSubmission = function(num) {
  if (isNaN(num) || num <= 0 || num > 100) {
    throw "That is an invalid guess.";
  } else {
    this.playersGuess = num;
  }
  return this.checkGuess();
};

Game.prototype.checkGuess = function() {
  if (this.playersGuess === this.winningNumber) {
    $('#hint, #submit').prop('disabled', true);
    $('#subtitle').text("Press the Reset button to play again!");
    return "You Win!";
  } else {
    if (this.pastGuesses.indexOf(this.playersGuess) === -1) {
      this.pastGuesses.push(this.playersGuess);
      if (this.pastGuesses.length < 5) {
        $('.guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
        var diff = this.difference();
        if (this.isLower()) {
          $('#subtitle').text("Guess Higher!");
        } else {
          $('#subtitle').text("Guess Lower!");
        }
        if (diff < 10) {
          return "You\'re burning up!";
        } else if (diff > 10 && diff < 25) {
          return "You\'re lukewarm.";
        } else if (diff > 25 && diff < 50) {

          return "You\'re a bit chilly.";
        } else {
          return "You\'re ice cold!";
        }
      } else {
        $('#hint, #submit').prop('disabled', true);
        $('#subtitle').text("Press the Reset button to play again!");
        return "You Lose.";
      }
    } else {
      return "You have already guessed that number.";
    }
  }
};

Game.prototype.provideHint = function() {
  var fake1 = generateWinningNumber();
  var fake2 = generateWinningNumber();
  var hintArr = [this.winningNumber, fake1, fake2];

  return shuffle(hintArr);
};

function makeAGuess(game) {
  var guess = $('#player-input').val();
  $('#player-input').val('');
  var output = game.playersGuessSubmission(parseInt(guess, 10));
  $('#title').text(output);
}

// jQuery

$(document).ready(function() {
  var game = new Game();

  $('#submit').click(function(e) {
    makeAGuess(game);
  });

  $('#player-input').keypress(function(event) {
    if (event.which == 13) {
      makeAGuess(game);
    }
  });

  $('#hint').click(function() {
    var hints = game.provideHint();
    // disable hint for no cheating
    $('#hint').prop("disabled", true);
    $('#title').text('The winning number is ' + hints[0] + ', ' + hints[1] + ', ' + hints[2]);
  });

  $('#reset').on('click', function() {
    game = newGame();
    $('#title').text('Play the Guessing Game!');
    $('#subtitle').text('Guess a number between 1-100!');
    $('.guess').text('-');
    $('#hint, #submit').prop("disabled", false);
  });
});
