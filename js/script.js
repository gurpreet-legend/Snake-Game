console.log("This is my first Game.");

// ****************Game Variables and constants*************
let snakeDirection = { x:0, y:0};
const eatSound = new Audio("audio/eat2.mp3");
const gameOver = new Audio("audio/gameOver.mp3");
const gamebg = new Audio("audio/gamebg.mp3");
const moveSound = new Audio("audio/move3.mp3");
const oopsSound = new Audio("audio/oops.mp3");
let speed = 5; //or fps
let score = 0;
lastPaintTime = 0;
// let head = { x:12, y:12};
let snakeArr = [
    { x:12, y:12}
];
let food = { x:5, y:5};
let scoreVal = document.getElementById("score");
let highScoreVal = document.getElementById("highScore");
let highScore = localStorage.getItem("highScore");
if(highScore === null){
    initialHighScore = 0;
    localStorage.setItem("highScore", JSON.stringify(initialHighScore));
}
else{
    highScoreVal.innerHTML = `High Score : `+highScore;
}
let lives = document.getElementById("lives");
let livesVal = 3;
let scoreBoard = document.getElementById("scoreBoard");
let board = document.getElementById("board");
let gameOverBox = document.getElementById("gameOver");
gameOverBox.style.display = "none";
let startBox = document.getElementById("start")
let restartBtn = document.getElementById("restartBtn");

//*************Game Functions**************

// Let the initial time:
let prevTime = Date.now();
function main() {
    window.requestAnimationFrame(main);
    let currTime = Date.now();
    
    let fpsInterval = 1/speed; // In seconds
    let elapsed = (currTime - prevTime)/1000; // In seconds

    //Increase speed after score > 10
    if(score > 10){
        speed = 8;
    }

    if(elapsed > fpsInterval){  // here, 1/speed is basically the frame interval and (currTime - prevTime) == elapsed Time
        //Assign the prev time with the currTime + (extra time elapsed):
        prevTime = currTime - (elapsed % fpsInterval)*1000;
        // Run the gameEngine:
        gamebg.play();
        gameEngine();
    }
    else{
        return;
    }
}

function isCollision(){
    // When you collide into yourself
    for (let i = 1; i < snakeArr.length; i++) {
        if(snakeArr[0].x === snakeArr[i].x && snakeArr[0].y === snakeArr[i].y)
        {
            return true;
        }
    }

    // When you collide with wall
    if(snakeArr[0].x >=18 || snakeArr[0].x<0 || snakeArr[0].y>=18 || snakeArr[0].y <0)
    {
        return true;
    }
}

function gameEngine() {
    //Part1: Updating the Snake array and food
    //(i) When Collision happens:
    if(isCollision(snakeArr)){
        snakeDirection = { x:0, y:0};
        snakeArr = [{ x:12, y:12}];
        livesVal -= 1;
        if(livesVal === 2){
            oopsSound.play();
            lives.innerHTML = `Lives : 🐍🐍`;
        }
        if(livesVal === 1){
            oopsSound.play();
            lives.innerHTML = `Lives : 🐍`;
        }
        if(livesVal === 0)
        {
            gameOver.play();
            gamebg.pause();
            // alert("GameOver! Press any key to start again");
            scoreBoard.style.display = "none";
            board.style.display = "none";
            gameOverBox.style.display = "flex";
            window.addEventListener('keydown', (e)=>{
                if(e.keyCode === 13){
                    scoreBoard.style.display = "block";
                    board.style.display = "grid";
                    gameOverBox.style.display = "none";
                    gamebg.play();
                    score = 0;
                    scoreVal.innerHTML = `Score : `+score;
                    lives.innerHTML = `Lives : 🐍🐍🐍`;
                    livesVal = 3;
                    speed = 5;
                    snakeDirection = { x:0, y:0};
                    main();
                }
            });
        }
    }

    //(ii) When food is eaten: (Increment snakeArr and generate new Food)
    if(snakeArr[0].x === food.x && snakeArr[0].y === food.y){
        eatSound.play();
        score += 1; 
        scoreVal.innerHTML = `Score : `+score;
        if(score > highScore){
            localStorage.setItem("highScore", JSON.stringify(score));
            highScoreVal.innerHTML = `High Score : `+ score;
        }
        snakeArr.unshift({x: snakeArr[0].x + snakeDirection.x, y: snakeArr[0].y + snakeDirection.y})
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b-a)*Math.random()) , y: Math.round(a + (b-a)*Math.random())} //********************* BUG: WHAT IF FOOD IS GENERATED AT THE BODY OF SNAKE!!//
    }
    
    //(iii) Updation:
    for (let i = snakeArr.length - 2; i >= 0 ; i--) {
        snakeArr[i+1] = {...snakeArr[i]};
        // snakeArr[i].x = snakeArr[i-1].x;   //You can also use this but for that you have to intialize i =snakeArr.length-1 and have to end at i>0 (0 not included) 
        // snakeArr[i].y = snakeArr[i-1].y;     
    }
    snakeArr[0].x += snakeDirection.x;
    snakeArr[0].y += snakeDirection.y;

 
    //Part2: Displat/Render the Snake and Food
    // (i) Display Snake :
    board = document.getElementById("board");
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement("div");
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.style.gridRowStart = e.y;
        if(index === 0){
            snakeElement.classList.add('head');
        }
        else{
            snakeElement.classList.add('snakeBody');
        }
        board.appendChild(snakeElement);
    });
    //(ii) Display food:
    let foodElement = document.createElement("div");
    foodElement.style.gridColumnStart = food.x;
    foodElement.style.gridRowStart = food.y;
    foodElement.classList.add('food');
    foodElement.style.display="flex";
    foodElement.style.justifyContent = "center";
    foodElement.style.alignItems = "center";
    foodElement.style.fontSize = "2.5rem";
    // foodElement.style. = ;
    foodElement.innerHTML = "🍖";
    board.appendChild(foodElement);
}

//**************Game Logic***************
scoreBoard.style.display = "none";
board.style.display = "none";
startBox.style.display = "flex";
window.addEventListener('keydown', (e)=>{
        scoreBoard.style.display = "block";
        board.style.display = "grid";
        startBox.style.display = "none"; 
        snakeDirection = { x:0, y:0};
        main();
});
window.addEventListener('keydown', (e)=>{
    // snakeDirection = { x:0 , y:1};
    moveSound.play();
    
    //Assigning keys:
    switch (e.key) {
        case "ArrowUp":
            // console.log("ArrowUp") 
            snakeDirection.x = 0;
            snakeDirection.y = -1;
            break;
        case "ArrowDown":
            // console.log("ArrowDown") 
            snakeDirection.x = 0;
            snakeDirection.y = 1;
            break;
        case "ArrowLeft":
            // console.log("ArrowLeft")
            snakeDirection.x = -1;
            snakeDirection.y = 0;
            break;
        case "ArrowRight":
            // console.log("ArrowRight") 
            snakeDirection.x = 1;
            snakeDirection.y = 0;
            break;  
        default:
            break;
    }
})

restartBtn.addEventListener("click", ()=>{
    location.reload();
})
