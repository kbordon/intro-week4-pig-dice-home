// back-end
function Player(name) {
  this.playerName = name;
  this.totalScore = 0;
  this.turnScore = 0;
}

Player.prototype.rollDice = function(number) {
  var diceQuantity = [];
  for (var diceIndex = 0; diceIndex < number; diceIndex++) {
    diceQuantity.push(Math.floor(Math.random() * (6-1 + 1)) + 1);
  }
  if (diceQuantity[0] === 1) {
    if (diceQuantity[1] === 1) {
      this.turnScore = 0;
      this.totalScore = 0;
      return "Z";
    } else {
      this.turnScore = 0;
      return 0;
    }
  } else {
    diceQuantity.forEach(function(rolledNumber){
      this.turnScore += rolledNumber;
    });
    // this.turnScore = this.turnScore + diceQuantity[0];
    // if (diceQuantity[1]) {
    //   this.turnScore += diceQuantity[1];
    // }
    if (this.totalScore + this.turnScore >= 100) {
      this.totalScore = this.totalScore + this.turnScore;
      return "A";
    }
    return diceQuantity;
  }
}

Player.prototype.rollTwoDice = function() {
  var rollArray = [];
  for (var diceNumber = 0; diceNumber < 2; diceNumber++) {
    rollArray.push(Math.floor(Math.random() * (6-1 + 1)) + 1);
  }
  if (rollArray[0] === 1 && rollArray[1] === 1) {
    this.turnScore = 0;
    this.totalScore = 0;
    return "Z";
  } else if (rollArray[0] === 1 || rollArray[1] === 1) {
    this.turnScore = 0;
    return 0;
  } else {
    this.turnScore = this.turnScore + rollArray[0] + rollArray[1];
      if (this.totalScore + this.turnScore >= 100) {
        this.totalScore = this.totalScore + this.turnScore;
        return "A";
      }
    return rollArray;
  }
}

Player.prototype.holdDie = function() {
  this.totalScore = this.totalScore + this.turnScore;
  this.turnScore = 0;
}

// front-end
$(document).ready(function(){
  $("#player-form").submit(function(event) {
    event.preventDefault();
    var luckyHarry = new Audio('lucky.mp3');
    var oneSound = new Audio('one.mp3');
    var snakeEyes = new Audio('snakeeyes.mp3');
    luckyHarry.play();

    $("#create-players").hide();
    $(".game-box").show();
    $("button#button-hold").attr("disabled", "disabled");

    var playerArray = [];
    $("input.player").each(function() {
      var newPlayer = new Player($(this).val());
      playerArray.push(newPlayer);
    });

    for (var playersIndex = 0; playersIndex < playerArray.length; playersIndex++) {
      $("#score-keeper").append("<li class='player-" + playersIndex + "'>" + playerArray[playersIndex].playerName + "<br><span class='total-" + playersIndex + "'>" + 0 + "</span></li>");
    }

    var currentPlayerIndex = 0;

    $("button#button-play").click(function () {
      $(".player-" + currentPlayerIndex).addClass("score-current");
      $("#button-hold").removeAttr("disabled");
      var dieResult = playerArray[currentPlayerIndex].rollTwoDice();

      if (dieResult[0] === "A") {
        $("#button-play, #button-hold").attr("disabled", "disabled");
        $("#score-total").text(playerArray[currentPlayerIndex].playerName + " WINS! Your Score is " + playerArray[currentPlayerIndex].totalScore + "!");
        $(".total-" + currentPlayerIndex).text(playerArray[currentPlayerIndex].totalScore);
      } else if (dieResult[0] === "Z") {
        snakeEyes.play();
        $("#button-hold").attr("disabled", "disabled");
        $(".player-" + currentPlayerIndex).removeClass("score-current");
        $("#score-total").text(playerArray[currentPlayerIndex].playerName + " rolled snake eyes, and lost everything! They're back at ZERO.")
        $(".total-" + currentPlayerIndex).text(playerArray[currentPlayerIndex].totalScore);
        if ((playerArray.length - 1) === currentPlayerIndex) {
          currentPlayerIndex = 0;
        } else {
          currentPlayerIndex++;
        }
        $(".player-" + currentPlayerIndex).addClass("score-current");
      } else if (dieResult === 0) {
        $("#button-hold").attr("disabled", "disabled");
        $(".player-" + currentPlayerIndex).removeClass("score-current");
        $("#score-total").text(playerArray[currentPlayerIndex].playerName + " rolled a 1, and lost their turn!")
        oneSound.play();
        if ((playerArray.length - 1) === currentPlayerIndex) {
          currentPlayerIndex = 0;
        } else {
          currentPlayerIndex++;
        }
        $(".player-" + currentPlayerIndex).addClass("score-current");
      } else {
        $("#score-total").text(playerArray[currentPlayerIndex].playerName + " rolled a " + dieResult.join(' & ') + ". Turn Score: " + playerArray[currentPlayerIndex].turnScore);
        if (dieResult[0] === dieResult[1]) {
          $("#button-hold").attr("disabled", "disabled");
          $("#score-total").append("<br>Doubles <em>must</em> roll again!");
        }
      }
    });

    $("button#button-hold").click(function () {
      playerArray[currentPlayerIndex].holdDie();
      $("#button-hold").attr("disabled", "disabled");
      $(".player-" + currentPlayerIndex).removeClass("score-current");
      $("#score-total").text(playerArray[currentPlayerIndex].playerName + " held.");
      $(".total-" + currentPlayerIndex).text(playerArray[currentPlayerIndex].totalScore);
      if ((playerArray.length - 1) === currentPlayerIndex) {
        currentPlayerIndex = 0;
      } else {
        currentPlayerIndex++;
      }
      $(".player-" + currentPlayerIndex).addClass("score-current");
      $("#score-total").append(" It's " + playerArray[currentPlayerIndex].playerName + "'s turn.");
    })

    $("button#button-reset").click(function() {
      window.location.reload();
    });
  });
});
