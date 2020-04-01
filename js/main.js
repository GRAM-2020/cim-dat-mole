(function () {
  //Variables we will give an initial Value
  let fieldSize, startingLifes, peekTime, turnTime, lifeCounter, hit, runningGame, fieldActive;

  //Variables that have a connection to the Dom Element
  const startRetryButton = select("#start-retry");
  const hole = select("#hole");
  const mole = select("#mole");

  // Values that change
  let countdownInput = select("#countdown");
  let life = select("#life");
  let level = select("#level");

  //Sounds
  let vol = 0.5;
  let labelVol = select('#labelvolume')
  let inputVol = select('#volume')
  let countDownAudio = new Audio();
  countDownAudio.src = 'sound/countdown.mp3'
  let hitAudio = new Audio();
  hitAudio.src = 'sound/hit.mp3'
  let gameOverAudio = new Audio();
  gameOverAudio.src = 'sound/gameover.mp3'
  let levelUpAudio = new Audio();
  levelUpAudio.src = 'sound/levelup.mp3'
  let loseAudio = new Audio();
  loseAudio.src = 'sound/lose.mp3'
  let retryAudio = new Audio();
  retryAudio.src = 'sound/retry.mp3'

  // inital Values
  function initVars() {
    countdownInput.value = "Ready?";
    runningGame = false;
    startingLifes = 3;
    currentLevel = 1;
    level.value = currentLevel;
    life.value = startingLifes;
    fieldSize = 9;
    fieldActive = false;
    hit = false;
  }

  // ****************************  The Board  ****************************
  // Here we laod in the holefield, which gets the attribute active=true,
  // that means it has an higher i-index than active=false and is visible
  function initField() {
    let img;
    for (let i = 0; i < fieldSize; i++) {
      img = create("img");
      img.draggable = false;
      img.src = "img/hole.png";
      img.setAttribute("data-active", 'true');
      img.setAttribute("data-img", "hole");
      img.addEventListener('click', checkClick);
      hole.appendChild(img);
    }
  }

  // Here we laod in the molefield, with active false, both hole and mole get img attribute
  // to let us know if we clickt a hole or mole
  function crazyMole() {
    let img;
    for (let i = 0; i < fieldSize; i++) {
      img = create("img");
      img.draggable = false
      img.src = "img/mole.png";
      img.setAttribute("data-active", 'false');
      img.setAttribute("data-img", "mole");
      img.addEventListener('click', checkClick)
      mole.appendChild(img);
    }
  }

  // **************************** ChangeVolume  ****************************
  function changeVolume() {
    // console.log(this)
    vol = parseInt(this.value);
    labelVol.innerHTML = vol;
    countDownAudio.volume = vol / 100
    gameOverAudio.volume = vol / 100
    hitAudio.volume = vol / 100
    levelUpAudio.volume = vol / 100
    loseAudio.volume = vol / 100
    retryAudio.volume = vol / 100
  }
  inputVol.addEventListener('input', changeVolume);
  // ****************************  Starting/restarting the game + Countdown ****************************
  // Countdown for the game u can only click once, the variable runningGame is set to true
  startRetryButton.addEventListener('click', () => {
    if (life.value < startingLifes) {
      retryAudio.play();
    }
    initVars();
    countdown()
  })
  function countdown() {
    if (!runningGame) {
      runningGame = true;
      setTimeout(() => { countdownInput.value = 3; countDownAudio.play(); }, 1000)
      setTimeout(() => countdownInput.value = 2, 2000)
      setTimeout(() => countdownInput.value = 1, 3000)
      setTimeout(() => { countdownInput.value = "Fight!"; startGame() }, 4000)
    }

  }

  // **************************** Check for Click Event  ****************************
  //Here we check for an click Event if its a hole u lose 1 life, u always get a hit, prevents loosing 2 lifes
  function checkClick(e) {
    if (fieldActive) {
      if (this.getAttribute('data-active') === "true" && this.getAttribute('data-img') === 'hole') {
        loseAudio.play();
        hit = true;
        life.value--
      } else {
        hitAudio.play();
        hit = true;
        //if u hit a mole u get the mole_hited img, gets reseted after each instance
        this.src = 'img/mole_hited.png';

      }
      // Here we can check if you hit a hole and have 0 Lifes the game is over
      if (life.value === "0") {
        gameOverAlert()
      }
    }
  }

  // **************************** First time starting the Game  ****************************
  function startGame() {

    const holeImgs = selectAll("[data-img='hole']");
    const moleImgs = selectAll("[data-img='mole']");
    const allImgs = selectAll('img')


    // now the function checkClick will update the score
    fieldActive = true;

    (function raiseLevel() {
      if (runningGame) {
        level.value = currentLevel;
        setTimeout(() => {
          levelUpAudio.play();
          currentLevel++;
          raiseLevel()
        }, 5000);
      }

    })()

    // **************************** Logic for one Instance of the Game  ****************************
    function oneTurn() {
      peekTime = 350 + 1000 / currentLevel;
      turnTime = 450 + 1000 / currentLevel
      const random = Math.floor(Math.random() * fieldSize);
      //if a mole_hited png is still in the field just overwrite it at the start of an instance
      moleImgs.filter(i => (i.src !== 'img/mole.png') ? i.src = 'img/mole.png' : i)
      // Here we say if u didn't hit anything u will loose a life, and if u did hit something we reset the Value hit to false
      function oneTurnCheck() {
        toggle(moleImgs[random]);
        // hit is set to false in the init Vars
        if (!hit) {
          loseAudio.play();
          life.value--;
          if (life.value === "0") {
            gameOverAlert()

          }
        }
        hit = false;
      }
      // here we start one turn and test if hit is true or false, than we restart a new Instance of the Game
      toggle(moleImgs[random]);
      setTimeout(() => oneTurnCheck(), peekTime)

      setTimeout(() => {
        if (life.value > 0) {
          oneTurn()
        }
        startRetryButton.innerText = 'Retry';
      }

        , peekTime + turnTime)
    };

    oneTurn();
  }




  // **************************** EndDisplay  ****************************
  // needs to live outside so the startGame and the checkClick can use the fkt
  function gameOverAlert() {
    gameOverAudio.play();
    alert(`GAME OVER! You have reached level ${currentLevel}`)
    runningGame = false;
  }

  // Ausführung
  initVars();
  initField();
  crazyMole();
})();

