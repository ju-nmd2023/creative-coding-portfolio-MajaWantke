function setup() {
  createCanvas(innerWidth, innerHeight);

  rotationSlider = createSlider(-45, 45, 0, 1);
  rotationSlider.position(20, 20);
}

const centerX = innerWidth / 2;
const centerY = innerHeight / 2;
const w = 400;
const h = 400;
const pearlRadius = 5;

let pearls = [];
let rotationAngle = 0;

function draw() {
  rotationAngle = rotationSlider.value();
  drawLines();
  updatePearls();
  drawPearls();
  checkMouseHover();
}

function drawLines() {
  background(255);
  stroke(0);
  strokeWeight(3);

  push();
  translate(centerX, centerY);
  rotate(radians(rotationAngle));

  for (let i = 0; i < h; i += 20) {
    const y = -h / 2 + i;
    line(-w / 2, y, w / 2, y);
  }
  pop();
}

function updatePearls() {
  const flowSpeed = 0.05 * abs(rotationAngle);
  const dir = rotationAngle > 0 ? 1 : -1;

  for (let i = pearls.length - 1; i >= 0; i--) {
    let p = pearls[i];
    p.x += dir * flowSpeed;

    const xMin = centerX - w / 2;
    const xMax = centerX + w / 2;
    if (p.x - pearlRadius < xMin || p.x + pearlRadius > xMax) {
      pearls.splice(i, 1);
    }
  }
}

function drawPearls() {
  noStroke();
  fill(0);

  push();
  translate(centerX, centerY);
  rotate(radians(rotationAngle));

  for (let p of pearls) {
    circle(p.x - centerX, p.y - centerY, pearlRadius * 2);
  }
  pop();
}

function checkMouseHover() {
  let angle = radians(-rotationAngle);
  let dx = mouseX - centerX;
  let dy = mouseY - centerY;
  let xUnrot = dx * cos(angle) - dy * sin(angle) + centerX;
  let yUnrot = dx * sin(angle) + dy * cos(angle) + centerY;

  for (let i = 0; i < h; i += 20) {
    const y = centerY - h / 2 + i;
    const x1 = centerX - w / 2 + pearlRadius;
    const x2 = centerX + w / 2 - pearlRadius;

    if (yUnrot > y - 10 && yUnrot < y + 10 && xUnrot > x1 && xUnrot < x2) {
      let canPlace = true;
      for (let p of pearls) {
        if (p.y === y && abs(p.x - xUnrot) < pearlRadius * 2) {
          canPlace = false;
          break;
        }
      }
      if (canPlace) {
        pearls.push({ x: xUnrot, y: y });
      }
      break;
    }
  }
}
