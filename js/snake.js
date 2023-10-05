// constants && defult
const score_box = document.getElementById("score_box");
const highscore_box = document.getElementById("highscore_box");
let bord = document.getElementById("bord");
const gameOverDiv = document.getElementById("gameOverDiv");
const gameOverMsg = document.getElementById("gameOver-msg");
const Continue = document.getElementById("Continue");
const hiscorediv=document.getElementById("hiscorediv");
const borderOpenSpan=document.querySelectorAll(".borderOpenSpan");
let isgameover = false;
let intputDir = { x: 0, y: 0 };
const foodSound = new Audio("audio/food.mp3");
const gameoverSound = new Audio("audio/gameover.mp3");
const moveSound = new Audio("audio/move.mp3");
const musicSound = new Audio("audio/music.mp3");
// const musicSound = new Audio("audio/naginSong.mp3");
// const musicSound = new Audio("audio/MainNagin.mp3");
// let borderOpenLevel=Math.floor(Math.random()*8+2);
let borderOpenLevel=2;

if(localStorage.getItem("borderOpenLevel")!==null){borderOpenLevel=+localStorage.getItem("borderOpenLevel")}
const isBorderOpenClassAdd = localStorage.getItem('borderOpen');
var level = 1;
if(localStorage.getItem("level")!==null){level=+localStorage.getItem("level")}
console.log(level,typeof(level ));
let levelUpgredScore=1;
if(localStorage.getItem("levelUpgredScore")!==null){levelUpgredScore=+localStorage.getItem("levelUpgredScore")} 
// creat obstacles array
 function generateObstacleArray(numObstacles, minSharedCount) {
    const obstacleArr = [];
    const sharedValues = new Map();
  
    // Generate random objects
    for (let i = 0; i < numObstacles; i++) {
      const x = Math.floor(Math.random() * 16+1); // Adjust the range as needed
      const y = Math.floor(Math.random() * 16+1); // Adjust the range as needed
  
      // Check if at least minSharedCount objects share the same x or y value
      const hasSharedValue = [...sharedValues.keys()].some((value) => {
        return Math.abs(x - value) <= 1 || Math.abs(y - value) <= 1;
      });
  
      if (!hasSharedValue) {
        // Generate a new x or y value that hasn't been shared too much
        const newValue = Math.random() < 0.5 ? x : y;
        if (!sharedValues.has(newValue)) {
          sharedValues.set(newValue, 0);
        }
  
        sharedValues.set(newValue, sharedValues.get(newValue) + 1);
      }
  
      obstacleArr.push({ x, y });
    }
  
    return obstacleArr;
  } 
  //genaret Random object except obstical position
  function generateRandomObject(obsticalearr,x) {
    // console.log(obsticalearr);
    let randomObject;
    const maxAttempts = 100; // Maximum attempts to generate a non-matching object
  
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      randomObject = {
        x: Math.floor(Math.random() * x+1), // Adjust the range as needed
        y: Math.floor(Math.random() * x+1) // Adjust the range as needed
      };
  
      // Check if the random object matches any object in obsticalearr
      const isMatching = obsticalearr.some(obstacle => (
        obstacle.x === randomObject.x && obstacle.y === randomObject.y
      ));
  
      if (!isMatching) {
        // If it doesn't match any object, return the random object
        return randomObject;
      }
    }
  
    // If we couldn't generate a non-matching object after maxAttempts, return null or handle the error as needed.
    return null;
  }

  // New high score funtion 
  const newHighScore =(Hscore)=>{
      hiscorediv.innerHTML=`You create a new High Score <br> ${Hscore}`;
      hiscorediv.style.display="block";
      hiscorediv.classList.add("newHighScore");
  }
  

  
let obsticalearr = [
  { x: 8, y: 9 },
  { x: 8, y: 10 },
  { x: 8, y: 11 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
  { x: 5, y: 10 },
  { x: 12, y: 13 },
  { x: 12, y: 14 },
  { x: 12, y: 15 },
  { x: 14, y: 13 },
  { x: 15, y: 13 },
  { x: 16, y: 13 },
];
if(localStorage.getItem("obsticalearr")!==null){
  let arr=localStorage.getItem("obsticalearr");
  obsticalearr=[...JSON.parse(arr)]; 
}



let speed = 5;
let lastprintTime = 0;
let tempObject=generateRandomObject(obsticalearr,16);

while(tempObject===null){tempObject=generateRandomObject(obsticalearr,16); };
let snakearr = [{ x: tempObject.x, y:  tempObject.y }];
tempObject=generateRandomObject(obsticalearr,18);
while(tempObject===null){tempObject=generateRandomObject(obsticalearr,18); };

let food = { x: tempObject.x, y:  tempObject.y };

let score = 0;
let HighScore = 0;
let spacel_food = 0;
const min_time = 5;
const max_time = 10;
let spacel_food_time = Math.round(
  min_time + (max_time - min_time) * Math.random()
);
//game function
function main(ctime) {
  musicSound.play();
  animationId = window.requestAnimationFrame(main);
  if ((ctime - lastprintTime) / 1000 < 1 / speed) {
    return;
  }
  lastprintTime = ctime;
  gameEngine();
}
// Check Snake game over or not
function isCollid(sarr) {
  let isobstical=false;

  for (let i = 1; i < snakearr.length; i++) {
    if (sarr[i].x === sarr[0].x && sarr[i].y === sarr[0].y) {
      return true;
    }
  }
if(localStorage.getItem("obsticalearr")!==null){
    let arr=localStorage.getItem("obsticalearr");
    obsticalearr=[...JSON.parse(arr)]; 
}

obsticalearr.forEach((obj)=>{
    if(JSON.stringify(sarr[0])===JSON.stringify(obj)){
        isobstical=true;
        return;
        

    }

})
if(isobstical){
    return true;
}

  if (
   ( level === 2||isBorderOpenClassAdd==='true') &&
    sarr[0].y >= 8 &&
    sarr[0].y <= 10 &&
    (sarr[0].x <= 0 || sarr[0].x > 18)
  ) {

    return false;
  }
  if (sarr[0].x > 18 || sarr[0].x <= 0 || sarr[0].y > 18 || sarr[0].y <= 0) {
    return true;
  }
  return false;
}

// Game over Funtion

const gameover = () => {
  gameoverSound.play();

  setTimeout(() => gameoverSound.pause(), 1000);
  cancelAnimationFrame(animationId);

  musicSound.pause();

  intputDir = { x: 0, y: 0 };
  if(score>levelUpgredScore){
    incresLeve();
  }
  gameOverMsg.style.display = "block";
  Continue.style.display = "block";
  gameOverMsg.innerHTML = `Game Over`;
  Continue.innerText = `Continue lavel ${localStorage.getItem('level')!==null ? localStorage.getItem('level') :1}`;
  gameOverDiv.classList.add("gameOver");

  if (HighScore < score) {
    HighScore = score;
    newHighScore(HighScore);
    localStorage.setItem("hiscore", JSON.stringify(HighScore));
    highscore_box.innerHTML = "High scoure : " + HighScore;
  }
 
};

// Gameengine function

function gameEngine() {
  
  // updetting snake array and food
  
  if (isCollid(snakearr)) {
    gameover();
  }
  //if snake eaten  food  increment the score   regenaret the food
  if (+snakearr[0].y === +food.y && +snakearr[0].x === +food.x) {
    foodSound.play();
    if (spacel_food === spacel_food_time) {
      score += 5;
      spacel_food = 0;
      spacel_food_time = Math.round(
        min_time + (max_time - min_time) * Math.random()
      );
    } else {
      score += 1;
    }
    score_box.innerHTML = score;
    snakearr.unshift({
      x: snakearr[0].x + intputDir.x,
      y: snakearr[0].y + intputDir.y,
    });
    // let a = 2;
    // let b = 16;
    tempObject=generateRandomObject(obsticalearr,18);
while(tempObject===null){tempObject=generateRandomObject(obsticalearr,18); };

    spacel_food += 1;
    food = {
      x:tempObject.x,
      y: tempObject.y,
    };
   

    speed = speed + 0.05;
  }

  // moveing the snak
  if (
    ( level === 2||isBorderOpenClassAdd==='true')&&
    snakearr[0].y >= 8 &&
    snakearr[0].y <= 10 &&
    (snakearr[0].x <= 0 || snakearr[0].x > 18)
  ) {

    if (snakearr[0].x <= -1) {
      snakearr[0].x = 18;
      while (!snakearr[0].x === 17);
    }
    if (snakearr[0].x > 18) snakearr[0].x = 0;

  }
  for (let i = snakearr.length - 2; i >= 0; i--) {
    snakearr[i + 1] = { ...snakearr[i] };
  }
  snakearr[0].x += intputDir.x;
  snakearr[0].y += intputDir.y;

  //display the snake
  bord.innerHTML = "";
  snakearr.forEach((e, index) => {
    snakElement = document.createElement("div");
    snakElement.style.gridRowStart = e.y;
    snakElement.style.gridColumnStart = e.x;
    if (index === 0) {
      snakElement.classList.add("head");
    } else {
      snakElement.classList.add("snake");
    }
    bord.appendChild(snakElement);
  });

  // dispaly food
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;

  if (spacel_food === spacel_food_time) {
    foodElement.classList.add("spacel_food");
  } else {
    foodElement.classList.add("food");
  }
  bord.appendChild(foodElement);

  //Display obsticale in bord
  obsticalearr.forEach((e, index) => {
    obsticaleElement = document.createElement("div");
    obsticaleElement.style.gridRowStart = e.y;
    obsticaleElement.style.gridColumnStart = e.x;
    obsticaleElement.classList.add("obsticale");
    bord.appendChild(obsticaleElement);
  });
}

// main logic starts
var animationId = window.requestAnimationFrame(main);
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
  HighScore = 0;
  localStorage.setItem("hiscore", JSON.stringify(HighScore));
} else {
  HighScore = JSON.parse(hiscore);
  highscore_box.innerHTML =  hiscore;
}

window.addEventListener("keydown", (e) => {
  intputDir = { x: 0, y: 1 }; //start the game

  moveSound.play();

  switch (e.key) {
    case "ArrowUp":
      // console.log("ArrowUp");
      intputDir.x = 0;
      intputDir.y = -1;
      break;
    case "ArrowDown":
      //  console.log("ArrowDown");
      intputDir.x = 0;
      intputDir.y = 1;
      break;
    case "ArrowLeft":
      //  console.log("ArrowLeft");
      intputDir.x = -1;
      intputDir.y = 0;
      break;
    case "ArrowRight":
      //  console.log("ArrowRight");
      intputDir.x = 1;
      intputDir.y = 0;
      break;
    default:
      break;
  }
});

const incresLeve=()=>{
  
      
  if(localStorage.getItem("level")!==null)
   { level =localStorage.getItem("level");}
    level=+level+1;
    localStorage.setItem("level", JSON.stringify(level));
    borderOpenSpan.forEach((span)=>{
      if(level===borderOpenLevel)
      {span.classList.add("borderOpen");
      if(isBorderOpenClassAdd==='false'||isBorderOpenClassAdd===null){
        localStorage.setItem('borderOpen', 'true');
      borderOpenLevel=Math.floor(Math.random()*(borderOpenLevel+5)+borderOpenLevel);
      
        localStorage.setItem("borderOpenLevel", JSON.stringify(borderOpenLevel));
      }
    }
      else{
        if(span.classList.contains("borderOpen"))
        span.classList.remove("borderOpen");
        if(isBorderOpenClassAdd==='true'){localStorage.setItem('borderOpen', 'false');}
        
        
      }
        })

     obsticalearr=[...generateObstacleArray(Math.floor(Math.random() * 20+8), 3)]
    
    localStorage.setItem("obsticalearr", JSON.stringify(obsticalearr));
    
    levelUpgredScore=Math.floor((Math.random() * (levelUpgredScore+9))+levelUpgredScore);
    
    localStorage.setItem("levelUpgredScore", JSON.stringify(levelUpgredScore));
}

if(isBorderOpenClassAdd==='true' || level===2){
  console.log("border open level");
  borderOpenSpan.forEach((span)=>{
span.classList.add("borderOpen");
  })
}


