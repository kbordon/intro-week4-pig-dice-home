// back-end
function Player(name) {
  this.playerName = name;
  this.totalScore = 0;
  this.turnScore = 0;
}

// Player.prototype.rollDie = function() {
//   var rollResult = Math.floor(Math.random() * (6-1 + 1)) + 1;
//   if (rollResult === 1) {
//     this.turnScore = 0;
//   } else {
//     this.turnScore = this.turnScore + rollResult;
//     if (this.totalScore + this.turnScore >= 100) {
//       this.totalScore = this.totalScore + this.turnScore;
//       return "win";
//     }
//     return rollResult;
//
//   }
// }

Player.prototype.rollTwoDice = function() {
  debugger;
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
  // if (rollResult === 1) {
  //   this.turnScore = 0;
  // } else {
  //   this.turnScore = this.turnScore + rollResult;
  //   if (this.totalScore + this.turnScore >= 100) {
  //     this.totalScore = this.totalScore + this.turnScore;
  //     return "win";
  //   }
  //   return rollResult;
  //
  // }
}

Player.prototype.holdDie = function() {
  this.totalScore = this.totalScore + this.turnScore;
  this.turnScore = 0;
}

// front-end
$(document).ready(function(){
  $("#player-form").submit(function(event) {
    event.preventDefault();

    // var nameInput = $("#player-one").val();
    // var newPlayer = new Player(nameInput);
    var pigSound = new Audio('quiet_pig.mp3');
    $("#create-players").hide();
    $(".game-box").show();
    $("button#button-hold").attr("disabled", "disabled");

    var playerArray = [];
    $("input").each(function() {
      var newPlayer = new Player($(this).val());
      playerArray.push(newPlayer);
    })

    for ( var playersIndex = 0; playersIndex < playerArray.length; playersIndex++) {
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
        pigSound.play();
        if ((playerArray.length - 1) === currentPlayerIndex) {
          currentPlayerIndex = 0;
        } else {
          currentPlayerIndex++;
        }
        $(".player-" + currentPlayerIndex).addClass("score-current");
      } else {
        $("#score-total").text(playerArray[currentPlayerIndex].playerName + " rolled a " + dieResult[0] + " & " + dieResult[1]  + ". Turn Score: " + playerArray[currentPlayerIndex].turnScore);
        if (dieResult[0] === dieResult[1]) {
          $("#button-hold").attr("disabled", "disabled");
          $("#score-total").append("<br>Doubles <em>must</em> roll again!");
        }
      }


          // $("#score-total").text(playerArray[currentPlayerIndex].playerName + " text ");
      // if (dieResult === "win") {
      //   $("#button-play, #button-hold").attr("disabled", "disabled");
      //   $("#score-total").text(playerArray[currentPlayerIndex].playerName + " WINS! Your Score is " + playerArray[currentPlayerIndex].totalScore + "!");
      // } else if (dieResult) {
      //   $("#score-total").text(playerArray[currentPlayerIndex].playerName + " rolled a " + dieResult  + ". Turn Score: " + playerArray[currentPlayerIndex].turnScore);
      //   // $("button#button-hold").show();
      // } else {
      //   $("#button-hold").attr("disabled", "disabled");
      //   $(".player-" + currentPlayerIndex).removeClass("score-current");
      //   $("#score-total").text(playerArray[currentPlayerIndex].playerName + " rolled a 1, and lost their turn!")
      //   pigSound.play();
      //   if ((playerArray.length - 1) === currentPlayerIndex) {
      //     currentPlayerIndex = 0;
      //   } else {
      //     currentPlayerIndex++;
      //   }
      //   $(".player-" + currentPlayerIndex).addClass("score-current");
      //   $("#score-total").append(" It's <strong>" + playerArray[currentPlayerIndex].playerName + "'s</strong> turn.");
      // }

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

  })


});
