(function () {
  //Variables we will give an initial Value
  let fieldSize, startingLifes, peekTime, turnTime, lifeCounter, hit, runningGame, fieldActive;

  //Variables that have a connection to the Dom Element
  const startButton = select("#start");
  let countdownInput = select("#countdown")
  const hole = select("#hole");
  let life = select("#life")
  const mole = select("#mole");

  // inital Values we set here
  function initVars() {
    countdownInput.value = "Ready?";
    runningGame = false;
    startingLifes = 3;
    life.value = startingLifes;
    fieldSize = 9;
    peekTime = 1000;
    turnTime = 1200;
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
      img.draggable = false
      img.src = "img/hole.png";
      img.setAttribute("data-active", 'true');
      img.setAttribute("data-img", "hole");
      img.addEventListener('click', checkClick)
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

  // ****************************  Starting the game + Countdown ****************************
  // Countdown for the game u can only click once, the variable runningGame is set to true
  startButton.addEventListener('click', countdown)
  function countdown() {
    if (!runningGame) {
      runningGame = true
      setTimeout(() => countdownInput.value = 3, 1000)
      setTimeout(() => countdownInput.value = 2, 2000)
      setTimeout(() => countdownInput.value = 1, 3000)
      setTimeout(() => { countdownInput.value = "GO!"; startGame() }, 4000)
    }

  }

  // **************************** Check for Click Event  ****************************
  //Here we check for an click Event if its a hole u lose 1 life, u always get a hit, prevents loosing 2 lifes
  function checkClick(e) {
    if (fieldActive) {
      if (this.getAttribute('data-active') === "true" && this.getAttribute('data-img') === 'hole') {
        hit = true
        life.value--
      } else {
        hit = true
        //if u hit a mole u get the mole_hited img, gets reseted after each instance
        this.src = 'img/mole_hited.png'

      }
      // Here we can check if you hit a hole and have 0 Lifes the game is over
      if (life.value === "0") {
        uLost()
      }
    }
  }

  // **************************** Logic for one Instance of the Game  ****************************
  function startGame() {

    const holeImgs = selectAll("[data-img='hole']");
    const moleImgs = selectAll("[data-img='mole']");
    const allImgs = selectAll('img')

    //if a mole_hited png is still in the field just overwrite it at the start of an instance

    fieldActive = true // now the function checkClick will update the score



    function oneTurn() {
      const random = Math.floor(Math.random() * fieldSize);
      moleImgs.filter(i => (i.src !== 'img/mole.png') ? i.src = 'img/mole.png' : i)
      // Here we say if u didn't hit anything u will loose a life, and if u did hit something we reset the Value hit to false
      function oneTurnCheck() {
        toggle(moleImgs[random]);
        // hit is set to false in the init Vars
        if (!hit) {
          life.value--;
          if (life.value === "0") {
            uLost()
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
      }

        , peekTime + turnTime)
    };
    oneTurn();
  }




  // **************************** EndDisplay  ****************************
  // needs to live outside so the startGame and the checkClick can use the fkt
  function uLost() {
    alert('u lost')
  }



  // Ausführung
  initVars();
  initField();
  crazyMole();
})();

