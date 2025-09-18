let cols = 8;
let rows = 8;
let boxSize = 50;
let boxes = [];

function setup() {
  createCanvas(innerWidth, innerHeight);
  const startX = width / 2 - (cols * boxSize) / 2 + boxSize / 2;
  const startY = height / 2 - (rows * boxSize) / 2 + boxSize / 2;

  for (let i = 0; i < cols; i++) {
    boxes[i] = [];
    for (let j = 0; j < rows; j++) {
      boxes[i][j] = {
        x: startX + i * boxSize,
        y: startY + j * boxSize,
        angle: 0,
        targetAngle: 0,
        lastHovered: 0,
        hovering: false,
        breakTime: (i + 1) * 1000,
        maxAngle: radians((j + 1) * 10),
        col: color(map(i, 0, cols - 1, 180, 300),180, 255, 200)
      };
    }
  }
}

function draw() {
  background(245, 245, 250);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let b = boxes[i][j];

      let isHover =
        mouseX > b.x - boxSize / 2 &&
        mouseX < b.x + boxSize / 2 &&
        mouseY > b.y - boxSize / 2 &&
        mouseY < b.y + boxSize / 2;

      if (isHover) {
        b.targetAngle = b.maxAngle;
        b.hovering = true;
        b.lastHovered = millis();
      } else {
        if (b.hovering) {
          b.hovering = false;
          b.lastHovered = millis();
        }
        if (millis() - b.lastHovered > b.breakTime) {
          b.targetAngle = 0;
        }
      }

      b.angle = lerp(b.angle, b.targetAngle, 0.05);

      push();
      translate(b.x, b.y);
      rotate(b.angle);
      rectMode(CENTER);
      stroke(0, 0, 100, 100);
      strokeWeight(1.5);
      fill(b.col);
      rect(0, 0, boxSize - 4, boxSize - 4, 8);
      pop();
    }
  }
}
