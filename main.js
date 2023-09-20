import { COLORS } from "./colors";
import { BOARD_WIDTH, BOARD_HEIGHT, BLOCK_SIZE } from "./constants";
import { PIECES } from "./pieces";
import "./style.css";

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let isPaused = true;
const audio = new Audio("./sounds/background.mp3");
const audioClear = new Audio("./sounds/clear.wav");

const $SCORE = document.querySelector("[data-score]");

const $START_BUTTON = document.querySelector("[data-start-button");
const $RESET_BUTTON = document.querySelector("[data-reset-button]");
const $SOUND_BUTTON = document.querySelector("[data-sound-button]");
const $PAUSE_BUTTON = document.querySelector("[data-pause-button]");

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

const getRandomNumber = (length) => {
  return Math.floor(Math.random() * length);
};

const createBoard = () => {
  return Array(BOARD_HEIGHT)
    .fill()
    .map(() => Array(BOARD_WIDTH).fill(0));
};

let board = createBoard();
let score = 0;
let piece = {
  position: { x: 5, y: 0 },
  ...PIECES[getRandomNumber(PIECES.length)],
};

const draw = () => {
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        switch (value) {
          case 1:
            ctx.fillStyle = PIECES[0].color;
            break;
          case 2:
            ctx.fillStyle = PIECES[1].color;
            break;
          case 3:
            ctx.fillStyle = PIECES[2].color;
            break;
          case 4:
            ctx.fillStyle = PIECES[3].color;
            break;
          case 5:
            ctx.fillStyle = PIECES[4].color;
            break;
          case 6:
            ctx.fillStyle = PIECES[5].color;
            break;
          case 7:
            ctx.fillStyle = PIECES[6].color;
            break;
        }
        ctx.fillRect(x, y, 1, 1);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 0.1;
        ctx.strokeRect(x, y, 1, 1);
      }
    });
  });

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        ctx.fillStyle = piece.color;
        ctx.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 0.1;
        ctx.strokeRect(x + piece.position.x, y + piece.position.y, 1, 1);
      }
    });
  });
};

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      piece.position.x--;
      if (checkCollision()) {
        piece.position.x++;
      }
      break;
    case "ArrowRight":
      piece.position.x++;
      if (checkCollision()) {
        piece.position.x--;
      }
      break;
    case "ArrowDown":
      piece.position.y++;
      if (checkCollision()) {
        piece.position.y--;
        solidifyPiece();
        removeRows();
      }
      break;
    case "ArrowUp":
      const prevShape = piece.shape;
      rotatePiece();
      if (checkCollision()) {
        piece.shape = prevShape;
      }
      break;
  }
});

const checkCollision = () => {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 && board[y + piece.position.y]?.[x + piece.position.x] !== 0
      );
    });
  });
};

const solidifyPiece = () => {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        board[y + piece.position.y][x + piece.position.x] = value;
        ctx.fillStyle = piece.color;
        ctx.fillRect(y + piece.position.y, x + piece.position.x, 1, 1);
      }
    });
  });
  resetPiece();
};

const removeRows = () => {
  const rowsToRemove = [];
  board.forEach((row, y) => {
    if (row.every((value) => value !== 0)) {
      rowsToRemove.push(y);
    }
  });

  rowsToRemove.forEach((y) => {
    score += 10;
    board.splice(y, 1);
    audioClear.play();
    const newRow = Array(BOARD_WIDTH).fill(0);
    board.unshift(newRow);
  });
};

const resetPiece = () => {
  piece = {
    position: { x: 5, y: 0 },
    ...PIECES[getRandomNumber(PIECES.length)],
  };

  if (checkCollision()) {
    window.alert("Game Over");
    board.forEach((row) => row.fill(0));
    score = 0;
  }
};

const rotatePiece = () => {
  const rotated = [];
  for (let i = 0; i < piece.shape[0].length; i++) {
    const row = [];

    for (let j = piece.shape.length - 1; j >= 0; j--) {
      row.push(piece.shape[j][i]);
    }

    rotated.push(row);
  }

  piece.shape = rotated;
};

let dropCounter = 0;
let lastTime = 0;

const update = (time = 0) => {
  if (!isPaused) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;

    if (dropCounter > 1000) {
      piece.position.y++;
      dropCounter = 0;
    }

    if (checkCollision()) {
      piece.position.y--;
      solidifyPiece();
      removeRows();
    }

    draw();
    $SCORE.innerHTML = score;
  }
  window.requestAnimationFrame(update);
};

const toggleSound = () => {
  if (audio.paused && audio.currentTime > 0 && !audio.ended) {
    audio.play();
    $SOUND_BUTTON.querySelector("span").innerHTML = "ON";
  } else {
    audio.pause();
    $SOUND_BUTTON.querySelector("span").innerHTML = "OFF";
  }
};

const startGame = () => {
  isPaused = false;
  document.querySelector(".start-button").style.display = "none";
  update();
  audio.volume = 0.5;
  audio.play();
};
const resetGame = () => {
  resetPiece();
  board = createBoard();
  score = 0;
};
const pauseGame = () => {
  isPaused = !isPaused;
  $PAUSE_BUTTON.innerHTML = isPaused ? "Play" : "Pause";
  audio.pause();
};
$START_BUTTON.addEventListener("click", startGame);
$RESET_BUTTON.addEventListener("click", resetGame);
$SOUND_BUTTON.addEventListener("click", toggleSound);
$PAUSE_BUTTON.addEventListener("click", pauseGame);
