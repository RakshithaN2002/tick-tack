
// Get references to the HTML elements for the game board, status display, buttons, and inputs

const board = document.getElementById("board");
const statusDisplay = document.getElementById("status");
const resetButton = document.getElementById("reset");
const startGameButton = document.getElementById("startGame");
const gridSizeInput = document.getElementById("gridSize");
const winStreakInput = document.getElementById("winStreak");
const gameModeSelect = document.getElementById("gameMode");
const playerXIndicator = document.getElementById("playerX");
const playerOIndicator = document.getElementById("playerO");


// Game state variables
let currentPlayer = "X";
let gameActive = true;
let boardState = [];
let gridSize = 3;
let winStreak = 3;
let opponentType = "computer"; // 'computer' for AI, 'friend' for multiplayer


// Function to create the game board based on grid size
function createBoard() {
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
  boardState = Array(gridSize).fill().map(() => Array(gridSize).fill(""));

  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.row = Math.floor(i / gridSize);
    cell.dataset.col = i % gridSize;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
  }
  statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
  updateTurnIndicator();
}

function updateTurnIndicator() {
  playerXIndicator.classList.toggle("active", currentPlayer === "X");
  playerOIndicator.classList.toggle("active", currentPlayer === "O");
}

function handleCellClick(event) {
  const cell = event.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  if (boardState[row][col] !== "" || !gameActive) return;

  boardState[row][col] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("taken");

  if (checkWinner(row, col)) {
    statusDisplay.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    resetButton.style.display = "block";
    return;
  }

  if (boardState.flat().every(cell => cell !== "")) {
    statusDisplay.textContent = "It's a tie!";
    gameActive = false;
    resetButton.style.display = "block";
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
  updateTurnIndicator();

  if (opponentType === "computer" && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  if (!gameActive) return;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (boardState[row][col] === "") {
        boardState[row][col] = "O";
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.textContent = "O";
        cell.classList.add("taken");

        if (checkWinner(row, col)) {
          statusDisplay.textContent = `Player O wins!`;
          gameActive = false;
          resetButton.style.display = "block";
          return;
        }

        if (boardState.flat().every(cell => cell !== "")) {
          statusDisplay.textContent = "It's a tie!";
          gameActive = false;
          resetButton.style.display = "block";
          return;
        }

        currentPlayer = "X";
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        updateTurnIndicator();
        return;
      }
    }
  }
}


// Function to check if a player has won the game
function checkWinner(row, col) {
  const directions = [
    { dr: 0, dc: 1 },  // Horizontal
    { dr: 1, dc: 0 },  // Vertical
    { dr: 1, dc: 1 },  // Diagonal down-right
    { dr: 1, dc: -1 }, // Diagonal down-left
  ];


  // Check all four directions for a winning streak
  for (const { dr, dc } of directions) {
    let count = 1;


    // Check in one direction (positive step)
    for (let step = 1; step < winStreak; step++) {
      const r = row + step * dr;
      const c = col + step * dc;
      if (r >= 0 && c >= 0 && r < gridSize && c < gridSize && boardState[r][c] === currentPlayer) {
        count++;
      } else break;
    }


// Check in the opposite direction (negative step)
    for (let step = 1; step < winStreak; step++) {
      const r = row - step * dr;
      const c = col - step * dc;
      if (r >= 0 && c >= 0 && r < gridSize && c < gridSize && boardState[r][c] === currentPlayer) {
        count++;
      } else break;
    }

    if (count >= winStreak) return true;
  }
  return false;  // No winner found
}


// Event listener for starting a new game
startGameButton.addEventListener("click", () => {
  opponentType = gameModeSelect.value === "ai" ? "computer" : "friend";


   // Get grid size and win streak length from user input, with constraints
  gridSize = Math.max(3, Math.min(10, parseInt(gridSizeInput.value)));
  winStreak = Math.max(3, Math.min(gridSize, parseInt(winStreakInput.value)));


  // Event listener for resetting the game
  currentPlayer = "X";
  gameActive = true;
  resetButton.style.display = "none";
  createBoard();
});

// Event listener for resetting the game
resetButton.addEventListener("click", () => {
  currentPlayer = "X";
  gameActive = true;
  createBoard();
});

// Initialize game
createBoard();