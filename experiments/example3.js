let cols = 8;
let rows = 8;
let boxWidth, boxHeight;
let boxes = [];

function setup() {
  createCanvas(innerWidth, innerHeight);
  boxWidth = width / cols;
  boxHeight = height / rows;

  for (let i = 0; i < cols; i++) {
    boxes[i] = [];
    for (let j = 0; j < rows; j++) {
      boxes[i][j] = {
        x: i * boxWidth + boxWidth / 2,
        y: j * boxHeight + boxHeight / 2,
        angle: 0,
        targetAngle: 0,
        lastHovered: 0,
        hovering: false,
        breakTime: (i + 1) * 1000,
        maxAngle: radians((j + 1) * 10)
      };
    }
  }
}

function draw() {
  background(255);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let b = boxes[i][j];

      
      let isHover =
        mouseX > b.x - boxWidth / 2 &&
        mouseX < b.x + boxWidth / 2 &&
        mouseY > b.y - boxHeight / 2 &&
        mouseY < b.y + boxHeight / 2;

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
      fill(200, 220, 255);
      stroke(0);
      rect(0, 0, boxWidth - 2, boxHeight - 2);
      pop();
    }
  }
}
