const SIZE = 8;
let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));

let current = 'black';
const table = document.getElementById('board');
const info = document.getElementById('currentTurn');
const score = document.getElementById('score');
const restart = document.getElementById('restart');

function initTable(){
  table.innerHTML = '';
  for (let y = 0; y < SIZE; y++) {
    const row = table.insertRow();
    for (let x = 0; x < SIZE; x++) {
      const cell = row.insertCell();
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.addEventListener('click',(e) => cellClick(x, y));
    }
  }
}

function update(){
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const cell = table.rows[y].cells[x];
      cell.innerHTML = '';
      if (board[y][x]) {
        const disk = document.createElement('div');
        disk.classList.add('disk', board[y][x]);
        cell.appendChild(disk);
      }
    }
  }
  updateScore();
  info.textContent = (current === 'black') ? '黒の番です' : '白（CPU）の番です';
}

function updateScore(){
  let black = 0, white = 0;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (board[y][x] == 'black') black++;
      if (board[y][x] == 'white') white++;
    }
  }
  score.textContent = `黒: ${black}, 白: ${white}`;
}

function cellClick(x, y) {
  if (current !== 'black') return;

  if (board[y][x]) return;

  let flipped = getFlippedDisks(x, y, current);
  if (flipped.length == 0) return;

  board[y][x] = current;
  flipped.forEach(([fx, fy]) => board[fy][fx] = current);

  current = 'white';
  update();

  setTimeout(cpuMove, 500);
}

function cpuMove(){
  let moves = [];

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (board[y][x]) continue;

      let flipped = getFlippedDisks(x, y, current);
      if (flipped.length > 0) moves.push({ x, y, flipped });
    }
  }

  if (moves.length == 0) {
    current = 'black';
    return;
  }

  let move = moves[Math.floor(Math.random() * moves.length)];

  board[move.y][move.x] = current;
  move.flipped.forEach(([fx, fy]) => board[fy][fx] = current);

  current = 'black';
  update();
}

function getFlippedDisks(x, y, color) {
  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [-1, -1], [1, -1], [-1, 1]
  ];

  let flipped = [];

  for (let [dx, dy] of directions) {
    let nx = x + dx;
    let ny = y + dy;

    let toFlip = [];

    while (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE &&
      board[ny][nx] &&
      board[ny][nx] !== color) {
      toFlip.push([nx, ny]);
      nx += dx;
      ny += dy;
    }

    if (toFlip.length > 0 &&
      nx >= 0 && nx < SIZE &&
      ny >= 0 && ny < SIZE &&
      board[ny][nx] == color) {
      flipped.push(...toFlip);
    }
  }

  return flipped;
}

function restartGame(){
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));

  board[3][3] = 'white';
  board[3][4] = 'black';
  board[4][3] = 'black';
  board[4][4] = 'white';
  
  current = 'black';
  
  update();
}

restart.addEventListener('click', restartGame);

restartGame();

