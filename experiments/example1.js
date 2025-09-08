function setup() {
  createCanvas(innerWidth, innerHeight);

  const x1 = centerX - w / 2;
  const x2 = centerX + w / 2;
  segmentCount = Math.ceil((x2 - x1) / segmentSize); 

  for (let i = 0; i < lineCount; i++) {
    lineWeights[i] = new Array(segmentCount).fill(baseWeight);
  }
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
  background(255);

  for (let i = 0; i < lineCount; i++) {
    const y = centerY - h / 2 + i * spacing;
    const x1 = centerX - w / 2;

    for (let s = 0; s < segmentCount; s++) {
      const segX = x1 + s * segmentSize + segmentSize / 2;

      const d = dist(mouseX, mouseY, segX, y);

      if (d < spacing) {
        const targetWeight =
          baseWeight + (1 - d / spacing) * (maxExtra - baseWeight);

        lineWeights[i][s] = lerp(lineWeights[i][s], targetWeight, 0.07);
      }

      stroke(0);
      strokeWeight(lineWeights[i][s]);
      line(segX - segmentSize / 2, y, segX + segmentSize / 2, y);
    }
  }
}
