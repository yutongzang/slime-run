function triggerDeathAnim() {
  if (!gameOver) {
    if (score > highScore) highScore = score;
    gameOver = true;
    spawnParticles();
    deathDelay = DEATH_DELAY_FRAMES;
  }
}

function updateDeathAnim() {
  if (!deathAnim.active) return;

  if (deathAnim.phase === 'rising') {
    deathAnim.y += deathAnim.vy;
    deathAnim.vy *= 0.92;

    if (deathAnim.y <= 0) {
      deathAnim.y = 0;
      deathAnim.vy = 9;
      deathAnim.phase = 'bounce';
    }
  }

  if (deathAnim.phase === 'bounce') {
    deathAnim.y += deathAnim.vy;
    deathAnim.vy += -0.4;
    deathAnim.vy *= 0.8;

    if (deathAnim.y <= 0 && deathAnim.vy < 0) {
      deathAnim.vy *= -0.4;
    }

    if (abs(deathAnim.y) < 0.5 && abs(deathAnim.vy) < 0.5) {
      deathAnim.y = 0;
      deathAnim.vy = 0;
      deathAnim.phase = 'settled';
    }
  }

  if (deathAnim.phase === 'reset') {
    deathAnim.y += 33;
    if (abs(deathAnim.y) >= height) {
      deathAnim.active = false;
      deathAnim.y = height;
      deathAnim.phase = 'idle';
    }
  }
}

function drawDeathAnim() {
  if (!deathAnim.active) return;

  fill(255);
  noStroke();
  rect(0, deathAnim.y, width, height - deathAnim.y + height);

  stroke(200);
  strokeWeight(2);
  line(0, deathAnim.y, width, deathAnim.y);
  noStroke();

  if (deathAnim.phase === 'settled') {
    fill(30);
    textAlign(CENTER, CENTER);
    textSize(42);
    text('Game Over', width / 2, height / 2 - 50);

    textSize(18);
    fill(120);
    text('Score: ' + floor(score), width / 2, height / 2 + 10);

    let btnX = width / 2 - 85;
    let btnY = height / 2 + 50;
    let btnW = 170;
    let btnH = 44;
    fill(30);
    rect(btnX, btnY, btnW, btnH, 8);
    fill(255);
    textSize(16);
    text('Press R to restart', width / 2, btnY + btnH / 2);
    drawSlimeUI();

    gamePhase = 'gameOver';
  }
}

function drawUI() {
  push();
  let c = BIOME_COLORS[currentBiome];
  fill(c.fill[0], c.fill[1], c.fill[2]);
  noStroke();
  textSize(35);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 20, 20);

  textAlign(CENTER, BOTTOM);
  textSize(30);
  text('Press ↑ Jump,  Press ↓ Down', width / 2, height - 10);
  textAlign(RIGHT, TOP);

  textSize(35);
  text('Best Record: ' + highScore, width - 20, 20);
  pop();
}

function drawTitleScreen() {
  fill(120);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(18);
  text('Press Any Key to Start', width / 2, height / 2);
  textAlign(RIGHT, TOP);
  textSize(24);
  fill(0);
  text('Best Record: ' + highScore, width - 20, 20);
}

function drawStartScreen() {
  fill(30);
  noStroke();
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textFont('Cinzel');
  textSize(52);
  text('Slime Run', width / 2, height / 2 - 60);
  textStyle(NORMAL);

  let btnX = width / 2 - 80;
  let btnY = height / 2 + 30;
  let btnW = 160;
  let btnH = 44;
  fill(30);
  rect(btnX, btnY, btnW, btnH, 8);
  fill(255);
  textFont('Cinzel');
  textSize(18);
  text('Start Game', width / 2, btnY + btnH / 2);
  drawSlimeUI();
}

function drawSlimeUI() {
  let boxW = height * 0.15;
  let boxX = width * 0.06;
  let boxY = height / 2 - boxW / 2;
  image(slimeImages[selectedColor], boxX, boxY, boxW, boxW);

let colorBtnW = 120;
let colorBtnH = 34;
let colorBtnX = boxX + boxW / 2 - colorBtnW / 2;
let colorBtnY = boxY + boxW + 10;
  fill(100);
  rect(colorBtnX, colorBtnY, colorBtnW, colorBtnH, 5);
  fill(255);
  textSize(13);
  textAlign(CENTER, CENTER);
  text('Change Element', colorBtnX + colorBtnW / 2, colorBtnY + colorBtnH / 2);
}

function drawColorScreen() {
  background(240);

  fill(30);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(32);
  text('Choose Element', width / 2, 60);

  for (let i = 0; i < slimeColors.length; i++) {
    let col = i % 3;
    let row = floor(i / 3);
    let x = width / 2 - 200 + col * 150;
    let y = height / 2 - 100 + row * 120;

    if (i === selectedColor) {
      stroke(0);
      strokeWeight(4);
      noFill();
      rect(x - 2, y - 2, 84, 84, 8);
    }

    image(slimeImages[i], x, y, 80, 80);

    noStroke();
    fill(30);
    textSize(14);
    text(slimeColors[i].name, x + 40, y + 95);
  }

  fill(30);
  noStroke();
  rect(width / 2 - 70, height - 50, 120, 40, 8);
  fill(255);
  textSize(16);
  text('Back', width / 2 - 10, height - 30);
}

function drawSettingScreen() {
  fill(0, 0, 0, 150);
  noStroke();
  rect(0, 0, width, height);

  let panelW = 200;
  let panelH = 250;
  let panelX = width / 2 - panelW / 2;
  let panelY = height / 2 - panelH / 2;
  fill(240);
  rect(panelX, panelY, panelW, panelH, 12);

  fill(30);
  textAlign(CENTER, CENTER);
  textSize(28);
  text('Paused', width / 2, panelY + 35);

  fill(30);
  rect(width / 2 - 80, panelY + 70, 160, 44, 8);
  fill(255);
  textSize(16);
  text('Continue', width / 2, panelY + 92);

  fill(30);
  rect(width / 2 - 80, panelY + 125, 160, 44, 8);
  fill(255);
  textSize(16);
  text('Restart', width / 2, panelY + 147);

  fill(30);
  rect(width / 2 - 80, panelY + 180, 160, 44, 8);
  fill(255);
  textSize(16);
  text('Main Menu', width / 2, panelY + 202);
}