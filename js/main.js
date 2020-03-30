(function() {
  let fieldSize;
  const b1 = select("#b1");
  const game = select("#game");

  // initial Values
  function initVars() {
    startingLifes = 3;
    fieldSize = 9;
    // imgMix = shuffle1(loadImgSetting());
  }

  function initField() {
    let img;
    for (let i = 0; i < fieldSize; i++) {
      img = create("img");
      img.src = "img/hole.gif";
      img.setAttribute("data-nr", i);
      // img.addEventListener("click", checkImg); //
      game.appendChild(img);
    }
  }

  // Ausführung
  initVars();
  initField();
})();
