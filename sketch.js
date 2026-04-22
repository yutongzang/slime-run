function preload() {
  bgImages['desert']     = loadImage('Background/Desert_background_4.png');
  bgImages['snow']       = loadImage('Background/Snow_biome_background_9.png');
  bgImages['jungle']     = loadImage('Background/Jungle_background_6.png');
  bgImages['underworld'] = loadImage('Background/Underworld_background_2.png');
  bgImages['ocean']      = loadImage('Background/Ocean_background_5.png');
  bgImages['hallow']     = loadImage('Background/Hallow_background_3.png');
  slimeImages[0] = loadImage('Slime/pyro.png');
  slimeImages[1] = loadImage('Slime/hydro.png');
  slimeImages[2] = loadImage('Slime/cryo.png');
  slimeImages[3] = loadImage('Slime/dendro.png');
  slimeImages[4] = loadImage('Slime/electro.png');
  slimeImages[5] = loadImage('Slime/geo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  groundY = height * 0.75;
  startPlatformY = height * 0.75;
  PLATFORM_MIN_Y = height * 0.225;
  PLATFORM_MAX_Y = height * 0.85;
  lastPlatformY = startPlatformY;

  document.addEventListener('keydown', function(e) {
    if (gamePhase === 'title') {
      gamePhase = 'playing';
      return;
    }
    if (e.key === 'Escape' && gamePhase === 'playing' && !gameOver) {
      gamePhase = 'setting';
      return;
    }
    if (gamePhase === 'setting') return;

    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      e.preventDefault();
      if (!gameOver && coyoteFrames > 0) {
        player.vy = JUMP_FORCE;
        player.onGround = false;
        coyoteFrames = 0;
        jumpKeyHold = true;
        jumpHoldFrames = 0;
      }
    }

    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      if (!gameOver && !player.onGround) {
        player.vy = 12;
      }
    }

    if ((e.key === 'r' || e.key === 'R') && gameOver) {
      restartGame();
    }
  });

  document.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      jumpKeyHold = false;
      jumpHoldFrames = 0;
    }
  });

  let startPlat = buildPlatform(0, startPlatformY, windowWidth * 1.5);
  startPlat.x = 0;
  startPlat.speed = 5;
  platforms.push(startPlat);

  player = {
    x: width * 0.175,
    y: groundY - 50,
    w: 30,
    h: 30,
    vy: 0,
    gravity: 1,
    onGround: true
  };

  currentBiome = SLIME_BIOME[selectedColor];
  lastLevel = 0;
  deathAnim.y = height;
}

deathDelay = DEATH_DELAY_FRAMES;

let deathAnim = {
  active: false,
  y: 0,
  targetY: 0,
  vy: 0,
  phase: 'idle'
};

document.addEventListener('mousedown', function() {
  if (gamePhase === 'select') {
    let btnX = width / 2 - 80;
    let btnY = height / 2 + 30;
    let btnW = 160;
    let btnH = 44;
    if (mouseX > btnX && mouseX < btnX + btnW &&
        mouseY > btnY && mouseY < btnY + btnH) {
      gamePhase = 'playing';
    }

  let boxW = height * 0.15;
  let boxX = width * 0.06;
  let boxY = height / 2 - boxW / 2;
  let colorBtnW = 120;
  let colorBtnH = 34;
  let colorBtnX = boxX + boxW / 2 - colorBtnW / 2;
  let colorBtnY = boxY + boxW + 10;
    if (mouseX > colorBtnX && mouseX < colorBtnX + colorBtnW &&
        mouseY > colorBtnY && mouseY < colorBtnY + colorBtnH) {
      gamePhase = 'color';
    }
  }

  if (gamePhase === 'color') {
    for (let i = 0; i < slimeColors.length; i++) {
      let col = i % 3;
      let row = floor(i / 3);
      let x = width / 2 - 200 + col * 150;
      let y = height / 2 - 100 + row * 120;
      if (mouseX > x && mouseX < x + 80 &&
          mouseY > y && mouseY < y + 80) {
        selectedColor = i;
        currentBiome = SLIME_BIOME[selectedColor];
      }
    }
    if (mouseX > width / 2 - 70 && mouseX < width / 2 + 50 &&
        mouseY > height - 50 && mouseY < height - 10) {
      gamePhase = 'select';
    }
  }

  if (gamePhase === 'gameOver') {
  let boxW = height * 0.15;
  let boxX = width * 0.06;
  let boxY = height / 2 - boxW / 2;
  let colorBtnW = 120;
  let colorBtnH = 34;
  let colorBtnX = boxX + boxW / 2 - colorBtnW / 2;
  let colorBtnY = boxY + boxW + 10;
    if (mouseX > colorBtnX && mouseX < colorBtnX + colorBtnW &&
        mouseY > colorBtnY && mouseY < colorBtnY + colorBtnH) {
      gamePhase = 'recolor';
    }
  }

  if (gamePhase === 'recolor') {
    for (let i = 0; i < slimeColors.length; i++) {
      let col = i % 3;
      let row = floor(i / 3);
      let x = width / 2 - 200 + col * 150;
      let y = height / 2 - 100 + row * 120;
      if (mouseX > x && mouseX < x + 80 &&
          mouseY > y && mouseY < y + 80) {
        selectedColor = i;
        currentBiome = SLIME_BIOME[selectedColor];
      }
    }
    if (mouseX > width / 2 - 70 && mouseX < width / 2 + 50 &&
        mouseY > height - 50 && mouseY < height - 10) {
      gamePhase = 'gameOver';
    }
  }

  if (gamePhase === 'setting') {
    let panelW = 200;
    let panelH = 250;
    let panelX = width / 2 - panelW / 2;
    let panelY = height / 2 - panelH / 2;

    if (mouseX > width / 2 - 80 && mouseX < width / 2 + 80 &&
        mouseY > panelY + 70 && mouseY < panelY + 114) {
      gamePhase = 'playing';
    }
    if (mouseX > width / 2 - 80 && mouseX < width / 2 + 80 &&
        mouseY > panelY + 125 && mouseY < panelY + 169) {
      restartGame();
      gamePhase = 'playing';
    }
    if (mouseX > width / 2 - 80 && mouseX < width / 2 + 80 &&
        mouseY > panelY + 180 && mouseY < panelY + 224) {
      restartGame();
      gamePhase = 'select';
    }
  }
});

function draw() {
  if (biomeTransitioning && nextBiome) {
    if (gamePhase === 'playing') {
      bgX -= BG_SPEED;
      if (bgX <= -width) bgX = 0;
    }
    tint(185);
    image(bgImages[nextBiome], bgX, 0, width, height);
    image(bgImages[nextBiome], bgX + width, 0, width, height);
    tint(185, biomeAlpha);
    image(bgImages[currentBiome], bgX, 0, width, height);
    image(bgImages[currentBiome], bgX + width, 0, width, height);
    noTint();
    biomeAlpha -= 3;
    if (biomeAlpha <= 0) {
      currentBiome = nextBiome;
      nextBiome = null;
      biomeTransitioning = false;
      biomeAlpha = 255;
    }
  } else {
    if (gamePhase === 'playing') {
      bgX -= BG_SPEED;
      if (bgX <= -width) bgX = 0;
    }
    tint(185);
    image(bgImages[currentBiome], bgX, 0, width, height);
    image(bgImages[currentBiome], bgX + width, 0, width, height);
    noTint();
  }

  if (gamePhase === 'select') {
    background(240);
    drawStartScreen();
    return;
  }
  if (gamePhase === 'title') {
    drawTitleScreen();
    return;
  }
  if (gamePhase === 'color') {
    drawColorScreen();
    return;
  }
  if (gamePhase === 'recolor') {
    drawColorScreen();
    return;
  }

  if (!gameOver && gamePhase === 'playing') {
    updatePlayer();
    updatePlatfroms();
    score++;
    checkGameOver();
    spawnTimer++;
  }

  if (gameOver && !deathAnim.active) {
    deathDelay--;
    if (deathDelay <= 0) {
      deathAnim.active = true;
      deathAnim.y = height;
      deathAnim.vy = -height / 10;
      deathAnim.phase = 'rising';
    }
  }

  updateParticles();
  drawPlatforms();
  tint(244);
  drawPlayer();
  noTint();
  drawParticles();
  updateDeathAnim();
  drawUI();
  drawDeathAnim();

  if (gamePhase === 'setting') {
    drawSettingScreen();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  groundY = height * 0.75;
  startPlatformY = height * 0.75;
  PLATFORM_MIN_Y = height * 0.225;
  PLATFORM_MAX_Y = height * 0.85;
}

function restartGame() {
  isBump = false;
  gameStarted = false;
  deathAnim.active = false;
  deathAnim.y = height;
  deathAnim.phase = 'idle';

  obstacles = [];
  platforms = [];

  groundY = height * 0.75;
  startPlatformY = height * 0.75;
  PLATFORM_MIN_Y = height * 0.225;
  PLATFORM_MAX_Y = height * 0.85;

  let startPlat = buildPlatform(0, startPlatformY, windowWidth * 1.5);
  startPlat.x = 0;
  platforms.push(startPlat);
  lastPlatformY = startPlatformY;

  score = 0;
  gameOver = false;
  spawnTimer = 0;
  nextSpawn = 60;
  spawnTimer_pl = 0;
  nextSpawn_pl = 60;
  deathAnim.phase = 'reset';

  scrollX = 0;
  spawnQueue = [];
  nextPatternX = 400;
  lastPlatformY = startPlatformY;
  bgX = 0;

  gameSpeed = BASE_SPEED;

  player.y = startPlatformY - player.h;
  player.x = width * 0.175;
  player.vy = 0;
  player.onGround = true;
  particles = [];

  coyoteFrames = 0;

  currentBiome = SLIME_BIOME[selectedColor];
  lastLevel = 0;

  gamePhase = 'playing';
}