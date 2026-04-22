function updateObstacles() {
  if (spawnTimer > nextSpawn) {
    let h= random(20,70);       //Random heights and widths of obstacles
    obstacles.push({
      x: width,
      y: groundY - h,
      w: random(20,45),
      h: h,
      speed: 6
    });
    spawnTimer = 20;
    nextSpawn = floor(random(30, 90));
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= obstacles[i].speed;
    if (obstacles[i].x + obstacles[i].w < 0) {
      obstacles.splice(i, 1);
    }
  }
}

function backupdateObstacles() {

    obstacles.push({
      x: -50,
      y: 0,
      w: 10,
      h: backObstacleHeight,
    });
}

function drawObstacles() {
  fill(20, 150, 20);
  noStroke();
  for (let obs of obstacles) {
    rect(obs.x, obs.y, obs.w, obs.h);
  }
}

function checkGameOver() {
  for (let obs of obstacles) {
    if (
      player.x < obs.x + obs.w &&
      player.x + player.w > obs.x &&
      player.y < obs.y + obs.h &&
      player.y + player.h > obs.y
    ) {
      if (score > highScore) {
      highScore = score;
}
      triggerDeathAnim();
   //   gameOver = true;
    }
  }
  if(player.y >height){
    triggerDeathAnim();
   // gameOver = true;
  }
}