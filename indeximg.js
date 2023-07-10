//this file contains the original game, attempting photos, with the guess who questions

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Snake variables
let snakeSpeed = 7;
let tileCount = 25;
let tileSize = canvas.clientWidth / tileCount - 2;
let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 2;
let xVelocity = 0;
let yVelocity = 0;

// Apple variables
let appleX = 5;
let appleY = 5;

// Score variable
let score = 0;

// Employee data variables
let employees = [];
const employeePhotos = {};

// Load CSV file and initialize game
function loadCSVFile() {
  fetch('temp2.csv')
    .then((response) => response.text())
    .then((csvData) => {
      parseCSV(csvData);
      drawGame();
    })
    .catch((error) => {
      console.error('Error loading CSV file:', error);
    });
}

// Parse CSV data
function parseCSV(csvData) {
  Papa.parse(csvData, {
    header: true,
    complete: function (parsedData) {
      console.log('Parsed CSV data:', parsedData);
      employees = parsedData.data.map((row, index) => ({
        id: index,
        firstName: row.first,
        lastName: row.last,
        photoUrl: row.photoUrl,
        questions: Object.keys(row).slice(2),
        answers: Object.values(row).slice(2),
      }));
    },
    error: function (error) {
      console.error('CSV parsing error:', error);
    },
  });
}


function getRandomEmployee() {
  const randomIndex = Math.floor(Math.random() * employees.length);
  const randomEmployee = employees[randomIndex];
  return randomEmployee;
}


// Display onboarding popup
function displayOnboardingPopup(employee, question, answer) {
  const firstName = employee.firstName;
  const lastName = employee.lastName;
  const photoFilename = employee.photoUrl; // Filename of the local photo

  // Create the popup box element
  const popupBox = document.createElement('div');
  popupBox.classList.add('popup-box');

  // Create the popup content
  const content = document.createElement('div');
  content.innerHTML = `Here's how ${firstName} ${lastName} answered "${question}": ${answer}`;

  // Create an image element for the employee photo
  const photo = document.createElement('img');
  photo.src = `photos/${photoFilename}`; // Assuming photos are stored in the 'photos' directory
  photo.alt = `${firstName} ${lastName}`;

  // Append the content and photo to the popup box
  popupBox.appendChild(content);
  popupBox.appendChild(photo);

  // Append the popup box to the "popup-container" element
  document.getElementById('popup-container').appendChild(popupBox);

  setTimeout(() => {
    popupBox.remove();
  }, 3000);

  renderPopupHistory();
}


// Check collision and handle employee onboarding
function checkCollision() {
  if (appleX === headX && appleY === headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;

    const employee = getRandomEmployee();
    const availableQuestions = employee.questions.filter((_, index) => employee.answers[index] !== 'NA');

    if (availableQuestions.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const question = availableQuestions[randomIndex];
    const answerIndex = employee.questions.indexOf(question);
    const answer = employee.answers[answerIndex];

    displayOnboardingPopup(employee, question, answer);
  }
}

// Draw the snake on the canvas
function drawSnake() {
  ctx.fillStyle = 'rgb(39, 58, 233)';
  for (let i = 0; i < snakeParts.length; i++) {
    const part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }
  ctx.fillStyle = 'rgb(255, 120, 77)';
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

// Update the position of the snake
function changeSnakePosition() {
  headX += xVelocity;
  headY += yVelocity;
}

// Draw the apple on the canvas using employee photo
function drawApple() {
  if (appleX === null || appleY === null) {
    return;
  }

  const employee = getRandomEmployee();
  const photo = employeePhotos[employee.id];

  photo.onload = function () {
    ctx.drawImage(photo, appleX * tileCount, appleY * tileCount, tileSize, tileSize);
  };
}

// Clear the canvas
function clearScreen() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw the game
function drawGame() {
  changeSnakePosition();
  const isGameOver = isCollision();
  if (isGameOver) {
    gameOver();
    return;
  }
  clearScreen();
  drawSnake();
  drawApple();
  checkCollision();
  drawScore();
  setTimeout(drawGame, 1000 / snakeSpeed);
}

// Check if the game is over
function isCollision() {
  if (headX < 0 || headX === tileCount || headY < 0 || headY === tileCount) {
    return true;
  }
  for (let i = 0; i < snakeParts.length; i++) {
    if (snakeParts[i].x === headX && snakeParts[i].y === headY) {
      return true;
    }
  }
  return false;
}

// Handle game over
function gameOver() {
  ctx.fillStyle = 'black';
  ctx.font = '50px Helvetica';
  ctx.fillText('Game Over!', canvas.clientWidth / 6.5, canvas.clientHeight / 2);
}

// Draw the score on the canvas
function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '10px Verdana';
  ctx.fillText('Score: ' + score, canvas.width - 50, 10);
}

// Handle keyboard input
function handleKeyPress(event) {
  const key = event.code;
  if (key === 'ArrowUp' && yVelocity !== 1) {
    yVelocity = -1;
    xVelocity = 0;
  } else if (key === 'ArrowDown' && yVelocity !== -1) {
    yVelocity = 1;
    xVelocity = 0;
  } else if (key === 'ArrowLeft' && xVelocity !== 1) {
    yVelocity = 0;
    xVelocity = -1;
  } else if (key === 'ArrowRight' && xVelocity !== -1) {
    yVelocity = 0;
    xVelocity = 1;
  }
}

// Prevent scrolling on arrow key press
window.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }
});

// Start the game
loadCSVFile();
document.addEventListener('keydown', handleKeyPress);
drawGame();