function updatePlayer() {
  player.onGround = false;

  // Power Jump //
  if (jumpKeyHold && jumpHoldFrames < JUMP_HOLD_MAX) {
    player.vy += JUMP_HOLD_FORCE;
    jumpHoldFrames++;
  }

  player.vy += player.gravity;

  let prevFeetY = player.y + player.h;
  player.y += player.vy;
  let currFeetY = player.y + player.h;

  // fall off the bottom of the screen die //
  if (player.y > height + 50) {
    triggerDeathAnim();
    return;
  }
    if (player.x < -40) {
    triggerDeathAnim();
    return;
  }
  let touchingBump = false;

 for (let p of platforms) {
    for (let cell of p.cells) {
      let tx = p.x + cell.cx * p.tileSize;
      let ty = p.y + cell.cy * p.tileSize;
      let ts = p.tileSize;

      // Use a generous xOverlap for landing detection, with a 2px edge tolerance //
      let xOverlapLand = player.x + player.w > tx - 2 && player.x < tx + ts + 2;
      // 侧面推力用精确的 xOverlap
      let xOverlap = player.x + player.w > tx && player.x < tx + ts;
      let yOverlap = player.y + player.h > ty && player.y < ty + ts;
      let crossedTop = prevFeetY <= ty && currFeetY >= ty;

      // Use a loose detection for ceiling-to-floor collisions //
      if (crossedTop && xOverlapLand && player.vy >= 0) {
        player.y = ty - player.h;
        player.vy = 0;
        player.onGround = true;
      }

      // Determine the protruding side with precision //
      if (cell.cy < 0 && xOverlap && yOverlap && !(crossedTop && player.vy >= 0)) {
        touchingBump = true;

        let overlapFromLeft = (player.x + player.w) - tx;
        if (overlapFromLeft > 0 && overlapFromLeft < ts) {
          player.x -= overlapFromLeft;
        }
      }
    }

  }

  // Coyote Frames //
  if (player.onGround) {
    coyoteFrames = COYOTE_MAX;
  } else {
    coyoteFrames = max(coyoteFrames - 1, 0);
  }

  // If no bump is encountered, slowly return to x=100 //
  if (!touchingBump) {
    player.x += (width * 0.175 - player.x) * 0.02;
  }

  // Pushed off the left edge, triggering death //
  if (player.x + player.w < -150) {
    triggerDeathAnim();
    return;
  }
}

function drawPlayer() {
  imageMode(CORNER);
  image(slimeImages[selectedColor], player.x, player.y, player.w, player.h);
}
