// Particles effect //

function spawnParticles(){
   for (let i = 0; i < 60; i++) {
    let angle = random(TWO_PI);        // Random direction
    let speed = random(20, 30);         // Random speed
    particles.push({
      x: player.x + player.w / 2,     // From player
      y: player.y + player.h / 2,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      size: random(4, 12),
      alpha: 255,                       //   
      decay: random(4, 10),            
      //color selecting
     
/*      col: random([
        color(255, 80, 30),            // 
        color(255, 200, 0),            // 
        color(255, 50, 50),            // 
      ])
      */
       col: slimeColors[selectedColor].color
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;      // Air resistance
    p.alpha -= p.decay;   // gradually disappearing

    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawParticles() {
  noStroke();
  for (let p of particles) {
    let c = color(red(p.col), green(p.col), blue(p.col), p.alpha);
    fill(c);
    rect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
}
function triggerParticle(){
  if (!gameOver) {
    gameOver = true;
    spawnParticles(); 
    deathAnim.active = true;
    deathAnim.y = height;
    deathAnim.vy = -36;
    deathAnim.phase = 'rising';
  }
}


/*
let slimeColors = [
  { name: 'Pyro',    color: '#FF4500' },
  { name: 'Hydro',   color: '#1E90FF' },
  { name: 'Cryo',    color: '#A8E4F0' },
  { name: 'Dendro',  color: '#4CAF50' },
  { name: 'Electro', color: '#9B59B6' },
  { name: 'Geo',     color: '#C8A84B' }
];
*/