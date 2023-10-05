const Fcontinue = () => {
    gameOverMsg.style.display="none";
    Continue.style.display="none";
    hiscorediv.classList.remove("newHighScore");
    gameOverDiv.classList.remove("gameOver");
    animationId = window.requestAnimationFrame(main);
    // alert("Continue");
    tempObject=generateRandomObject(obsticalearr,16);
    snakearr = [{ x: tempObject.x, y:  tempObject.y }];
  
    score = 0;
    score_box.innerHTML = score;
    speed = 3;
    spacel_food = 0;
    spacel_food_time = Math.round(
      min_time + (max_time - min_time) * Math.random()
    );
    intputDir = { x: 0, y: 0 };
    location.reload();
  };