function setup() {
  createCanvas(innerWidth, innerHeight);

  const startPoint = centerX - w / 2;
  const endPoint = centerX + w / 2;
  segmentCount = Math.ceil((endPoint - startPoint) / segmentSize); 

  for (let i = 0; i < lineCount; i++) {
    lineWeights[i] = new Array(segmentCount).fill(baseWeight);
  }
  strokeCap(ROUND);
}

const centerX = innerWidth / 2;
const centerY = innerHeight / 2;
const w = 400;
const h = 400;
const spacing = 20;
const segmentSize = 5;
const baseWeight = 3;
const maxExtra = spacing;

const lineCount = h / spacing;
let segmentCount;
let lineWeights = [];

function draw() {
  background(245, 245, 250);

  for (let i = 0; i < lineCount; i++) {
    const y = centerY - h / 2 + i * spacing;
    const startX = centerX - w / 2;

    for (let s = 0; s < segmentCount; s++) {
      const segX = startX + s * segmentSize + segmentSize / 2;

      const d = dist(mouseX, mouseY, segX, y);

      // Calculation of target line weight with help from ChatGPT
      if (d < spacing) {
        // Calculate target thickness: closer mouse --> thicker line
        const targetWeight = baseWeight + (1 - d / spacing) * (maxExtra - baseWeight);
        // Smoothly interpolate current weight towards target
        lineWeights[i][s] = lerp(lineWeights[i][s], targetWeight, 0.07);
      }

      const hue = map(y, centerY - h / 2, centerY + h / 2, 180, 300);
      const alpha = 200;

      stroke(hue, 150, 255, alpha);
      strokeWeight(lineWeights[i][s]);
      line(segX - segmentSize / 2, y, segX + segmentSize / 2, y);
    }
  }
}
