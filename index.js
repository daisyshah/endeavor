////this file contains the original game, without photos, with the trial csv file

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
//increase snake size
class snakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 7;
let tileCount = 20;

let tileSize = canvas.clientWidth / tileCount - 2;
let headX = 10;
let headY = 10;

// array for snake parts
const snakeParts = [];
let tailLength = 2;

//initialize the speed of snake
let xvelocity = 0;
let yvelocity = 0;

//draw apple
let appleX = 5;
let appleY = 5;

//scores
let score = 0;

// create game loop-to continously update screen
function drawGame() {
  changeSnakePosition();
  // game over logic
  let result = isGameOver();
  if (result) {
    // if result is true
    return;
  }
  clearScreen();
  drawSnake();
  drawApple();

  checkCollision();
  drawScore();
  setTimeout(drawGame, 1000 / speed); //update screen 7 times a second
}
//Game Over function
function isGameOver() {
  let gameOver = false;
  //check whether game has started
  if (yvelocity === 0 && xvelocity === 0) {
    return false;
  }
  if (headX < 0) {
    //if snake hits left wall
    gameOver = true;
  } else if (headX === tileCount) {
    //if snake hits right wall
    gameOver = true;
  } else if (headY < 0) {
    //if snake hits wall at the top
    gameOver = true;
  } else if (headY === tileCount) {
    //if snake hits wall at the bottom
    gameOver = true;
  }

  //stop game when snake crush to its own body

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      //check whether any part of snake is occupying the same space
      gameOver = true;
      break; // to break out of for loop
    }
  }

  //display text Game Over
  if (gameOver) {
    ctx.fillStyle = 'white';
    ctx.font = '50px verdana';
    ctx.fillText('Game Over! ', canvas.clientWidth / 6.5, canvas.clientHeight / 2); //position our text in center
  }

  return gameOver; // this will stop execution of drawgame method
}

// score function
function drawScore() {
  ctx.fillStyle = 'white'; // set our text color to white
  ctx.font = '10px verdena'; //set font size to 10px of font family verdena
  ctx.fillText('Score: ' + score, canvas.clientWidth - 50, 10); // position our score at right hand corner
}

// clear our screen
function clearScreen() {
  ctx.fillStyle = 'black'; // make screen black
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight); // black color start from 0px left, right to canvas width and canvas height
}
function drawSnake() {
  ctx.fillStyle = 'green';
  //loop through our snakeparts array
  for (let i = 0; i < snakeParts.length; i++) {
    //draw snake parts
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }
  //add parts to snake --through push
  snakeParts.push(new snakePart(headX, headY)); //put item at the end of list next to the head
  if (snakeParts.length > tailLength) {
    snakeParts.shift(); //remove furthest item from  snake part if we have more than our tail size
  }
  ctx.fillStyle = 'orange';
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}
function changeSnakePosition() {
  headX = headX + xvelocity;
  headY = headY + yvelocity;
}
function drawApple() {
  ctx.fillStyle = 'red';
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

// Display onboarding popup
function displayOnboardingPopup(employee) {
  const { firstName, lastName, funFact } = employee;
  // Create the popup box element
  const popupBox = document.createElement('div');
  popupBox.classList.add('popup-box');

  // Create the popup content
  const content = document.createElement('div');
  content.innerHTML = `How did ${firstName} ${lastName}! ${funFact}`;

  // Append the content to the popup box
  popupBox.appendChild(content);

  // Append the popup box to the "popup-container" element
  document.getElementById('popup-container').appendChild(popupBox);

  // Set a timeout to remove the popup after a certain duration
  setTimeout(() => {
    popupBox.remove();
  }, 3000); // Remove after 3 seconds (adjust the duration as needed)
}

// Preload employee photos
const employeePhotos = {};
let employees = [];

function preloadEmployeePhotos() {
  for (const employee of employees) {
    const photo = new Image();
    photo.src = employee.photoUrl;
    employeePhotos[employee.id] = photo;
  }
}

// Generate random employee data for the apple
function getRandomEmployee() {
  const randomIndex = Math.floor(Math.random() * employees.length);
  return employees[randomIndex];
}

function parseCSV(csvData) {
  Papa.parse(csvData, {
    header: true,
    complete: function (parsedData) {
      console.log('Parsed CSV data:', parsedData);
      const parsedEmployees = parsedData.data.map((row, index) => ({
        id: index,
        firstName: row.firstName,
        lastName: row.lastName,
        funFact: row.funFact,
        photoUrl: row.photoUrl,
      }));

      employees = parsedEmployees;
    },
    error: function (error) {
      console.error('CSV parsing error:', error);
    },
  });
}

function loadCSVFile() {
  fetch('test.csv')
    .then((response) => response.text())
    .then((csvData) => {
      parseCSV(csvData);
      preloadEmployeePhotos();
    })
    .catch((error) => {
      console.error('Error loading CSV file:', error);
    });
}

// Modify the `checkCollision` function to handle employee onboarding
function checkCollision() {
  if (appleX === headX && appleY === headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;

    // Get a random employee
    const employee = getRandomEmployee();

    // Display the onboarding popup with the employee's information
    displayOnboardingPopup(employee);
  }
}

//add event listener to our body
document.body.addEventListener('keydown', keyDown);

function keyDown() {
  //up
  if (event.keyCode == 38) {
    //prevent snake from moving in opposite direcction
    if (yvelocity == 1) return;
    yvelocity = -1;
    xvelocity = 0;
  }
  //down
  if (event.keyCode == 40) {
    if (yvelocity == -1) return;
    yvelocity = 1;
    xvelocity = 0;
  }

  //left
  if (event.keyCode == 37) {
    if (xvelocity == 1) return;
    yvelocity = 0;
    xvelocity = -1;
  }
  //right
  if (event.keyCode == 39) {
    if (xvelocity == -1) return;
    yvelocity = 0;
    xvelocity = 1;
  }
}

loadCSVFile();
drawGame();
