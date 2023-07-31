//this file contains the original game, without photos, with the guess who questions

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
let tileCount = 25;

let tileSize = 24;
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

let selectedEmployee = [];

// Variable to track if the game is paused
let isPaused = false;

// create game loop-to continuously update the screen
function drawGame() {

  if (isPaused) {
    // If the game is paused, don't update the game state
    setTimeout(drawGame, 1000 / speed);
    return;
  }

  changeSnakePosition();
  // game over logic
  let result = isGameOver();
  if (result) {
    // if the result is true
    return;
  }
  clearScreen();
  


  drawSnake();
  drawApple();

  checkCollision();
  drawScore();
  setTimeout(drawGame, 1000 / speed); //update screen 7 times a second
}

// Game Over function
function isGameOver() {
  let gameOver = false;
  //check whether the game has started
  if (yvelocity === 0 && xvelocity === 0) {
    return false;
  }
  if (headX < 0) {
    //if the snake hits the left wall
    gameOver = true;
  } else if (headX === tileCount) {
    //if the snake hits the right wall
    gameOver = true;
  } else if (headY < 0) {
    //if the snake hits the wall at the top
    gameOver = true;
  } else if (headY === tileCount) {
    //if the snake hits the wall at the bottom
    gameOver = true;
  }

  //stop the game when the snake crushes its own body

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      //check whether any part of the snake is occupying the same space
      gameOver = true;
      break; // to break out of the for loop
    }
  }

  //display text Game Over
  if (gameOver) {
    ctx.fillStyle = 'black';
    ctx.font = '50px helvetica';
    ctx.fillText('Game Over! ', canvas.clientWidth / 6.5, canvas.clientHeight / 2); //position our text in the center
  }

  return gameOver; // this will stop the execution of the drawgame method
}

// score function
function drawScore() {
  ctx.fillStyle = 'black'; // set our text color to black
  ctx.font = '10px verdana'; //set font size to 10px of font family verdana
  ctx.fillText('Score: ' + score, canvas.clientWidth - 50, 10); // position our score at the right-hand corner
}

// clear our screen
function clearScreen() {
  ctx.fillStyle = 'white'; // make the screen black
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight); // black color starts from 0px left, right to canvas width and canvas height
}

function drawSnake() {
  ctx.fillStyle = "rgba(39, 58, 233, 1)";
  //loop through our snakeparts array
  for (let i = 0; i < snakeParts.length; i++) {
    //draw snake parts
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }
  //add parts to snake --through push
  snakeParts.push(new snakePart(headX, headY)); //put the item at the end of the list next to the head
  if (snakeParts.length > tailLength) {
    snakeParts.shift(); //remove the furthest item from the snake part if we have more than our tail size
  }
  ctx.fillStyle = "rgba(255, 120, 77, 1)";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
  headX = headX + xvelocity;
  headY = headY + yvelocity;
}

// draw apple
function drawApple() {
  // Check if an employee is selected
  if (selectedEmployee.length === 0) {
    const appleImage = new Image();
    appleImage.src = "logo.png"; // default apple image
    // Wait for the image to load
    appleImage.onload = function () {
      ctx.drawImage(appleImage, appleX * tileCount, appleY * tileCount, tileSize, tileSize);
    };
  } else {
    const appleImage = new Image();
    appleImage.src = selectedEmployee.photoUrl; // selected employee's photo
    // Wait for the image to load
    appleImage.onload = function () {
      ctx.drawImage(appleImage, appleX * tileCount, appleY * tileCount, tileSize, tileSize);
    };
  }
}



// Display onboarding popup
function displayOnboardingPopup(employee) {
  const firstName = employee.firstName;
  const lastName = employee.lastName;
  const question = employee.question;
  const answer = employee.answer;

  // Create the popup box element
  const popupBox = document.createElement('div');
  popupBox.classList.add('popup-box');

  // Create the popup content
  const content = document.createElement('div');
  content.innerHTML = `Here's how ${firstName} ${lastName} answered "${question}": ${answer}`;

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
  const randomEmployee = employees[randomIndex];
  return randomEmployee;
}



function parseCSV(csvData) {
    Papa.parse(csvData, {
      header: true,
      complete: function (parsedData) {
        console.log('Parsed CSV data:', parsedData);
        const parsedEmployees = parsedData.data.map((row, index) => {
          const employee = {
            id: index,
            firstName: row.first,
            lastName: row.last,
            photoUrl: row.photoUrl,
          };
  
          // Extract the questions and answers from the CSV data
          employee.questions = Object.keys(row).filter((key) => key !== 'first' && key !== 'last' && key !== 'photoUrl');
          employee.answers = Object.values(row).filter((value, index) => index > 2);
  
          return employee;
        });
  
        employees = parsedEmployees;
      },
      error: function (error) {
        console.error('CSV parsing error:', error);
      },
    });
  }
  

function loadCSVFile() {
  fetch('tempUR.csv') // choose CSV file here
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

    // Get a random employee and store it in the selectedEmployee variable
    selectedEmployee = selectEmployee();

    // Display the onboarding popup with the employee's information and the chosen question
    displayOnboardingPopup(selectedEmployee);

    // Pause the game
    isPaused = true;
    setTimeout(() => {
      // Resume the game after a certain duration (adjust the duration as needed)
      isPaused = false;
    }, 1500); // Pause for 3 seconds (adjust the duration as needed)
  }
}


function selectEmployee() {
      // Get a random employee
      const employee = getRandomEmployee();

      // Filter out the questions with "NA" answers
      const availableQuestions = employee.questions.filter((_, index) => employee.answers[index] !== 'NA');
  
      // If there are no available questions, exit the function
      if (availableQuestions.length === 0) {
        return;
      }
  
      // Choose a random question from the available ones
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const question = availableQuestions[randomIndex];
      const answerIndex = employee.questions.indexOf(question);
      const answer = employee.answers[answerIndex];
      let selectedEmployee = {
        firstName: employee.firstName,
        lastName: employee.lastName,
        photoUrl: employee.photoUrl,
        question: question,
        answer: answer,
      };
      return selectedEmployee;
}
  

// add event listener to our body
document.body.addEventListener('keydown', keyDown);

function keyDown(event) {
  // up
  if (event.keyCode == 38) {
    // prevent snake from moving in the opposite direction
    if (yvelocity == 1) return;
    yvelocity = -1;
    xvelocity = 0;
  }
  // down
  if (event.keyCode == 40) {
    if (yvelocity == -1) return;
    yvelocity = 1;
    xvelocity = 0;
  }

  // left
  if (event.keyCode == 37) {
    if (xvelocity == 1) return;
    yvelocity = 0;
    xvelocity = -1;
  }
  // right
  if (event.keyCode == 39) {
    if (xvelocity == -1) return;
    yvelocity = 0;
    xvelocity = 1;
  }
}

// prevents keyboard from scrolling down
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

loadCSVFile();
drawGame();