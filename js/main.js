(function () {
  let fieldSize, startingLifes;
  const startButton = select("#start");
  startButton.addEventListener('click', countdown)
  let countdownInput = select("#countdown")
  const hole = select("#hole");
  const mole = select("#mole");
  console.log(countdownInput.value)
  // inital Values
  function initVars() {
    countdownInput.value = "Ready?";
    startingLifes = 3;
    fieldSize = 9;
  }

  function countdown() {
    setTimeout(() => countdownInput.value = 3, 1000)
    setTimeout(() => countdownInput.value = 2, 2000)
    setTimeout(() => countdownInput.value = 1, 3000)
    setTimeout(() => { countdownInput.value = "GO!"; startGame() }, 4000)

  }

  function initField() {
    let img;
    for (let i = 0; i < fieldSize; i++) {
      img = create("img");
      img.src = "img/hole.gif";
      img.setAttribute("data-active", 'true');
      img.setAttribute("data-img", "hole");
      hole.appendChild(img);
      img.addEventListener('click', checkActive)
    }
  }
  function crazyMole() {
    let img;
    for (let i = 0; i < fieldSize; i++) {
      img = create("img");
      img.src = "img/mole.gif";
      img.setAttribute("data-active", 'false');
      img.setAttribute("data-img", "mole");
      mole.appendChild(img);
      img.addEventListener('click', checkActive)
    }
  }



  function startGame() {
    const moleImgs = selectAll("[data-img='mole']");
    const holeImgs = selectAll("[data-img='hole']");
    const random = Math.floor(Math.random() * fieldSize)

    function toggle(arr) {
      let toggle = (arr.getAttribute('data-active') === 'true');
      toggle = !toggle

      arr.dataset.active = toggle
    }

    toggle(moleImgs[2]);
    setTimeout(() => toggle(moleImgs[2]), 3000)

  }


  function checkActive(e) {
    console.log(this.getAttribute('data-active'))
    console.log(e);
    console.log(this)
    if (this.getAttribute('data-active') === "true" && this.getAttribute('data-img') === 'hole') {
      console.log('u lost a life')
    } else {
      console.log('inactive')
    }
    // console.log(e.dataset.active)
    // if (e.dataset.active('data-active') === 1) {
    //   console.log('active')
    // }
  }

  // Ausführung
  initVars();
  initField();
  crazyMole();

})();

