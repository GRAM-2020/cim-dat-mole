(function() {
  //Initiate variables with undefined values
  let fieldSize,
    startingLives,
    peekTime,
    turnTime,
    playerHasClicked,
    runningGame,
    fieldActive,
    molesKilled;

  //Constants of query selected HTML elements
  const hole = select("#hole");
  const mole = select("#mole");
  const welcomeCard = select("#welcome-card");
  const gameOverCard = select("#game-over-card");
  const gameOverText = select("#game-over-text");
  const hideWelcomeCardButton = select("#hide-welcome-card");
  const hideGameOverCardButton = select("#hide-game-over-card");
  const startRetryButton = select("#start-retry");
  const playerNameInput = select("#player-name-input");
  const highScoreList = select("#high-score-list");

  //Game play variables
  let countdownInput = select("#countdown");
  let life = select("#life");
  let level = select("#level");
  let playerName = "";

  //Audio settings and all sounds
  let vol = 0.5;
  let labelVolume = select("#labelvolume");
  let inputVolume = select("#volume");
  let gameOverAudio = new Audio("sound/gameover.mp3");
  let countDownAudio = new Audio("sound/countdown.mp3");
  let hitAudio = new Audio("sound/hit.mp3");
  let levelUpAudio = new Audio("sound/levelup.mp3");
  let loseAudio = new Audio("sound/lose.mp3");
  let retryAudio = new Audio("sound/retry.mp3");

  //Initial game values
  function initialVariables() {
    startingLives = 3;
    life.value = startingLives;
    currentLevel = 1;
    level.value = currentLevel;
    molesKilled = 0;
    fieldSize = 9;
    fieldActive = false;
    playerHasClicked = false;
    runningGame = false;
    levelDuration = 6000;
  }

  //Hide the welcome card
  hideWelcomeCardButton.addEventListener("click", () => {
    welcomeCard.classList.add("display-none");
    if (!playerName) {
      playerName = "Maradun";
    }
    countdownInput.value = `Ready, ${playerName}?`;
  });

  //Player name input
  playerNameInput.addEventListener("change", e => {
    playerName = e.target.value;
    countdownInput.value = `Ready, ${playerName}?`;
  });

  //Volume control of all sounds with one slider
  function changeVolume() {
    vol = parseInt(this.value);
    labelVolume.innerHTML = vol;
    countDownAudio.volume = vol / 100;
    gameOverAudio.volume = vol / 100;
    hitAudio.volume = vol / 100;
    levelUpAudio.volume = vol / 100;
    loseAudio.volume = vol / 100;
    retryAudio.volume = vol / 100;
  }
  inputVolume.addEventListener("input", changeVolume);

  // ****************************  The Board  ****************************
  // Here we initiate the hole field. Holes get the attribute active=true,
  // that means they have a higher z-index than active=false -> they're visible
  function createHoleField() {
    let img;
    for (let i = 0; i < fieldSize; i++) {
      img = create("img");
      img.draggable = false;
      img.src = "img/hole.png";
      img.setAttribute("data-active", "true");
      img.setAttribute("data-img", "hole");
      img.addEventListener("mousedown", checkClickInGame);
      hole.appendChild(img);
    }
  }

  // Same with the mole field, but active=false - moles are hidden. In both fields the images get a data-img attribute (respectively hole or mole) and an event listener, to check the clicks later
  function createMoleField() {
    let img;
    for (let i = 0; i < fieldSize; i++) {
      img = create("img");
      img.draggable = false;
      img.src = "img/mole.png";
      img.setAttribute("data-active", "false");
      img.setAttribute("data-img", "mole");
      img.addEventListener("mousedown", checkClickInGame);
      mole.appendChild(img);
    }
  }

  //Countdown which will start the game
  //runningGame prevents you from starting multiple times
  function countdown() {
    if (!runningGame) {
      runningGame = true;
      setTimeout(() => {
        countdownInput.value = 3;
        countDownAudio.play();
      }, 1000);
      setTimeout(() => (countdownInput.value = 2), 2000);
      setTimeout(() => (countdownInput.value = 1), 3000);
      setTimeout(() => {
        countdownInput.value = "Fight!";
        startGame();
      }, 4000);
    }
  }

  startRetryButton.addEventListener("click", () => {
    if (life.value < startingLives) {
      retryAudio.play();
    }
    initialVariables();
    countdown();
  });

  //Outsourced function to check your in game clicks
  //Here we check if you hit the mole or missed it. A Miss = you lose a life. fieldActive is used to prevent multi-clicking per round.
  function checkClickInGame(e) {
    if (fieldActive) {
      playerHasClicked = true;
      //if you didn't hit. Play audio. Lose a life.
      if (
        this.getAttribute("data-active") === "true" &&
        this.getAttribute("data-img") === "hole"
      ) {
        loseAudio.play();
        life.value--;
      } else {
        //Counter goes up. Audio plays. Mole changes. Mole shakes.
        hitAudio.play();
        this.src = "img/mole_hitted.png";
        this.classList.add("shake");
        ++molesKilled;
      }

      //Check if you have lives left
      if (life.value === "0") {
        showGameOverCard();
      }
    }
  }

  // **************************** Actual starting of the game function  ****************************
  function startGame() {
    const holeImgs = selectAll("[data-img='hole']");
    const moleImgs = selectAll("[data-img='mole']");
    const allImgs = selectAll("img");

    fieldActive = true;
    //Automatically raising the level
    (function raiseLevel() {
      if (runningGame) {
        level.value = currentLevel;
        setTimeout(() => {
          if (life.value > 0) {
            currentLevel++;
            levelUpAudio.play();
            raiseLevel();
          }
        }, levelDuration);
      }
    })();

    // **************************** Logic of one turn (= one mole attacks you) ****************************
    function oneTurn() {
      //time a mole peeks out of the hole
      peekTime = 350 + 1000 / currentLevel;
      //time until next mole shows up
      turnTime = 450 + 1000 / currentLevel;
      const random = Math.floor(Math.random() * fieldSize);

      //if a mole_hitted png is still in the field just overwrite it at the start of an instance
      moleImgs.filter(i =>
        i.src !== "img/mole.png" ? (i.src = "img/mole.png") : i
      );
      //if a shake class is still on a mole img remove it
      moleImgs.filter(i =>
        i.classList.contains("shake") ? i.classList.remove("shake") : i
      );

      //Show mole. Check if player has played/clicked, if not he couldn't have hitted a mole so minus a life. Check for remaining lives.
      function oneTurnCheck() {
        toggleVisibility(moleImgs[random]);
        if (!playerHasClicked) {
          loseAudio.play();
          life.value--;
          if (life.value === "0") {
            showGameOverCard();
          }
        }
        playerHasClicked = false;
      }

      // here we start one turn and test if hit is true or false, than we restart a new Instance of the Game
      toggleVisibility(moleImgs[random]);
      setTimeout(() => oneTurnCheck(), peekTime);
      setTimeout(() => {
        if (life.value > 0) {
          oneTurn();
        }
        startRetryButton.innerText = "Retry";
      }, peekTime + turnTime);
    }
    oneTurn();
  }

  // **************************** Game Over Card   ****************************
  // needs to live outside so the startGame and the checkClickInGame can use the fkt

  //Get old high score from local storage or init an array
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  //Create score element. Add to high score. Sort it scores. Cut at length 5. Save to local storage. Empty high score list. Add items from array as li to html. Create personalized game over text. Pl;ay audio. Show card. Switch game and field off.
  function showGameOverCard() {
    const score = {
      playername: playerName,
      level: currentLevel,
      kills: molesKilled
    };
    highScores.push(score);
    highScores.sort((a, b) => b.kills - a.kills);
    highScores.splice(5);
    localStorage.setItem("highScores", JSON.stringify(highScores));
    highScoreList.innerHTML = "";
    highScores.forEach(entry => {
      highScoreList.innerHTML += `<li> Level/Kills: ${entry.level}/${entry.kills} Name: ${entry.playername}</li>`;
    });
    gameOverText.innerText = `Congrats ${playerName}:
                  You have reached level ${currentLevel}!
                  The tales of this hunt will be long told after your death...`;
    gameOverAudio.play();
    gameOverCard.classList.add("display-block");
    runningGame = false;
    fieldActive = false;
  }
  //button to hide card again
  hideGameOverCardButton.addEventListener("click", () => {
    gameOverCard.classList.remove("display-block");
  });

  // Execution
  initialVariables();
  createHoleField();
  createMoleField();
})();
