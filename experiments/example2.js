function setup() {
  createCanvas(innerWidth, innerHeight);

  rotationSlider = createSlider(-45, 45, 0, 1);
  const sliderY = centerY + h / 2 + 65;
  const sliderX = centerX - rotationSlider.width / 2;
  rotationSlider.position(sliderX, sliderY);

  rotationSlider.style("accent-color", "#7d5fff");
}

const centerX = innerWidth / 2;
const centerY = innerHeight / 2;
const w = 400;
const h = 400;
const pearlRadius = 5;

const spacing = 20;
const lineCount = h / spacing;

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
  background(245, 245, 250);
  strokeCap(ROUND);

  push();
  translate(centerX, centerY);
  rotate(radians(rotationAngle));

  for (let i = 0; i < lineCount; i++) {
    const y = centerY - h / 2 + i * spacing;
    const startX = centerX - w / 2;

    const hue = map(y, centerY - h / 2, centerY + h / 2, 180, 300);
    const alpha = 200;
    stroke(hue, 150, 255, alpha);
    strokeWeight(3);

    line(startX - centerX, y - centerY, startX - centerX + w, y - centerY);
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
  push();
  translate(centerX, centerY);
  rotate(radians(rotationAngle));

  for (let p of pearls) {
    noStroke();
    fill(330, 100, 255, 180);
    circle(p.x - centerX, p.y - centerY, pearlRadius * 2);

    fill(255, 255, 255, 180);
    circle(p.x - centerX - 2, p.y - centerY - 2, pearlRadius);
  }
  pop();
}

function checkMouseHover() {
  // The following "unrotation" of the mouse position was implemented with the help of ChatGPT.
  // It maps the rotated canvas back to the original grid so we can test if the mouse is near a horizontal line.

  let angle = radians(-rotationAngle); // undo the current rotation
  let dx = mouseX - centerX;
  let dy = mouseY - centerY;
  
  // Apply reverse rotation matrix to (dx, dy)
  let xUnrot = dx * cos(angle) - dy * sin(angle) + centerX;
  let yUnrot = dx * sin(angle) + dy * cos(angle) + centerY;
  
  for (let i = 0; i < lineCount; i++) {
    const y = centerY - h / 2 + i * spacing;
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
