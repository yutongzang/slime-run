// Platform spawn //

function updatePlatfroms() {
 scrollX += gameSpeed; 

  if (scrollX >= nextPatternX) {
    let pattern = pickPattern();
    for (let step of pattern.platforms) {
      spawnQueue.push({
        spawnAtX: scrollX + step.dx,
        y: lastPlatformY + step.dy,
        w: step.w
      });
    }
    lastPlatformY += pattern.platforms[pattern.platforms.length - 1].dy;

    // Boundary correction does not affect the pattern structure //
    
    if (lastPlatformY < PLATFORM_MIN_Y) lastPlatformY = PLATFORM_MIN_Y;
    if (lastPlatformY > PLATFORM_MAX_Y) lastPlatformY = PLATFORM_MAX_Y;

    nextPatternX = scrollX + pattern.gap;
  }

  for (let i = spawnQueue.length - 1; i >= 0; i--) {
    if (scrollX >= spawnQueue[i].spawnAtX) {
      let s = spawnQueue[i];
      // When inserting the element, constrain y; do not change the dx spacing of the pattern //
      s.y = constrain(s.y, PLATFORM_MIN_Y, PLATFORM_MAX_Y);
      platforms.push(buildPlatform(width, s.y, s.w));
      spawnQueue.splice(i, 1);
    }
  }

  for (let i = platforms.length - 1; i >= 0; i--) {
    platforms[i].x -= gameSpeed; 
    if (platforms[i].x + platforms[i].w < 0) platforms.splice(i, 1);
  }
}
/*

function updatePlatfroms() {
  scrollX += 6; // 和平台速度保持一致

  // 到达触发点，把下一个 pattern 的所有平台加入队列
  if (scrollX >= nextPatternX) {
    let pattern = pickPattern();
    for (let step of pattern.platforms) {
      spawnQueue.push({
        spawnAtX: scrollX + step.dx,   // 在哪个 scrollX 时生成
        y: lastPlatformY + step.dy,
        w: step.w
      });
    }
    // 更新 lastPlatformY 为这组 pattern 最后一个平台的 y
    lastPlatformY += pattern.platforms[pattern.platforms.length - 1].dy;
    nextPatternX = scrollX + pattern.gap; // 下一个 pattern 的间距
  }

  // 每帧检查队列，到时间就释放
  for (let i = spawnQueue.length - 1; i >= 0; i--) {
    if (scrollX >= spawnQueue[i].spawnAtX) {
      let s = spawnQueue[i];
      platforms.push(buildPlatform(width, s.y, s.w));
      spawnQueue.splice(i, 1);
    }
  }

  // 移动所有平台
  for (let i = platforms.length - 1; i >= 0; i--) {
    platforms[i].x -= 6;
    if (platforms[i].x + platforms[i].w < 0) platforms.splice(i, 1);
  }
}

*/



function buildPlatform(x, y, w) {
  let cols = max(floor(w / tileSize), 5);

  let cells = [];
    for (let c = 0; c < cols; c++) {
      cells.push({ cx: c, cy: 0 });
  }

  // Bump rules: Maximum height of 1 cell; adjacent columns cannot protrude simultaneously;          skip the first and last columns //
  
  if (isBump ){
  let lastBumped = -5;
    for (let c = 1; c < cols - 1; c++) {
      if (c - lastBumped >= 5 && random() < 0.1) {
        let bumpHeight = floor(random(1, 5)); // 1~3 height
        for (let row = 1; row <= bumpHeight; row++) {
          cells.push({ cx: c, cy: -row });
        }
        lastBumped = c;
      }
    }
  }
  return {
    x: x,
    y: y,
    w: cols * tileSize,
    h: tileSize,
    speed: gameSpeed,
    cells: cells,
    cols: cols,
    tileSize: tileSize
  };
}



function drawPlatforms() {
  let c;
if (biomeTransitioning && nextBiome) {
  let curr = BIOME_COLORS[currentBiome];
  let next = BIOME_COLORS[nextBiome];
  let t = 1 - biomeAlpha / 255; // 0→1 过渡进度
  c = {
    fill:      [lerp(curr.fill[0],      next.fill[0],      t),
                lerp(curr.fill[1],      next.fill[1],      t),
                lerp(curr.fill[2],      next.fill[2],      t)],
    stroke:    [lerp(curr.stroke[0],    next.stroke[0],    t),
                lerp(curr.stroke[1],    next.stroke[1],    t),
                lerp(curr.stroke[2],    next.stroke[2],    t)],
    highlight: [lerp(curr.highlight[0], next.highlight[0], t),
                lerp(curr.highlight[1], next.highlight[1], t),
                lerp(curr.highlight[2], next.highlight[2], t)]
  };
} else {
  c = BIOME_COLORS[currentBiome];
}
  for (let p of platforms) {
    for (let cell of p.cells) {
      let tx = p.x + cell.cx * p.tileSize;
      let ty = p.y + cell.cy * p.tileSize;

      fill(c.fill[0], c.fill[1], c.fill[2]);
      stroke(c.stroke[0], c.stroke[1], c.stroke[2]);
      strokeWeight(1);
      rect(tx, ty, p.tileSize, p.tileSize);

      stroke(c.highlight[0], c.highlight[1], c.highlight[2]);
      strokeWeight(1);
      line(tx + 1, ty + 1, tx + p.tileSize - 1, ty + 1);
    }
  }
  noStroke();
}


function getAvailablePatterns() {
  let level = floor(score / 600);
  if (level > lastLevel) {
  lastLevel = level;
  let others = Object.keys(BIOME_COLORS).filter(b => b !== currentBiome);
  nextBiome = random(others);
  biomeTransitioning = true;
  biomeAlpha = 255;
}
    if(level>0){
    isBump =true;
  }
  
  // Difficulty level rise //
  
  gameSpeed = min(BASE_SPEED + level*0.5, MAX_SPEED);
 if (level === 0) return ['flat', 'flat', 'ascending', 'rhythm'];
  if (level === 1) return ['flat', 'ascending', 'descending', 'staircase_up', 'staircase_down', 'rhythm'];
  if (level === 2) return ['ascending', 'descending', 'zigzag', 'island', 'wave', 'staircase_up', 'staircase_down'];
  return ['zigzag', 'hard', 'double_stack', 'long_gap', 'cliff', 'wave', 'island'];
}

// Platform Generation Limits //


function pickPattern() {
  let available = getAvailablePatterns();
  //Near the top, go down //
   if (lastPlatformY < 160) {
    available = available.filter(name => name === 'descending' || name === 'flat');
    if (available.length === 0) available = ['descending'];
  }
  // Near the bottom, forcing the selection to move upward //
  else if (lastPlatformY > 300){
    available = available.filter(name => name === 'ascending' || name === 'flat');
    if (available.length === 0) available = ['ascending'];
  }
  
  let name = random(available);
  return PATTERNS.find(p => p.name === name);
}
