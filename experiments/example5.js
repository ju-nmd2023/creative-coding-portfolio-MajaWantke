let handpose;
let video;
let hands = [];

const fieldSize = 50;
const fieldSizeHalf = fieldSize / 2;
const maxCols = Math.ceil(innerWidth / fieldSize);
const maxRows = Math.ceil(innerHeight / fieldSize);
const divider = 10;
let field;
let agents = [];

class Boid {
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y);
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
    this.col = color(random(100, 255), random(100, 200), random(150, 255), 180);
  }

  follow(desiredDirection) {
    desiredDirection = desiredDirection.copy();
    desiredDirection.mult(this.maxSpeed);
    let steer = p5.Vector.sub(desiredDirection, this.velocity);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  checkBorders() {
    if (this.position.x < 0) this.position.x = width;
    else if (this.position.x > width) this.position.x = 0;
    if (this.position.y < 0) this.position.y = height;
    else if (this.position.y > height) this.position.y = 0;
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    noStroke();
    fill(this.col);
    ellipse(0, 0, 8);
    pop();
  }
}

function preload() {
  handpose = ml5.handPose();
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handpose.detectStart(video, getHandsData);

  field = generateField();
  generateAgents();
}

function generateField() {
  let field = [];
  noiseSeed(Math.random() * 100);
  for (let x = 0; x < maxCols; x++) {
    field.push([]);
    for (let y = 0; y < maxRows; y++) {
      const value = noise(x / divider, y / divider) * Math.PI * 2;
      field[x].push(p5.Vector.fromAngle(value));
    }
  }
  return field;
}

function generateAgents() {
  for (let i = 0; i < 200; i++) {
    let agent = new Boid(
      Math.random() * innerWidth,
      Math.random() * innerHeight,
      4,
      0.1
    );
    agents.push(agent);
  }
}

function draw() {
  setGradient(0, 0, width, height, color(240, 248, 255), color(220, 230, 250));
  for (let x = 0; x < maxCols; x++) {
    for (let y = 0; y < maxRows; y++) {
      const padding = 12;
      const value = field[x][y];
      let handClosed = false;
      if (hands.length > 0) {
        let indexTip = hands[0].index_finger_tip;
        let thumbTip = hands[0].thumb_tip;
        let distance = dist(indexTip.x, indexTip.y, thumbTip.x, thumbTip.y);
        if (distance < 40) handClosed = true;
      }
      if (handClosed) value.rotate(0.1);

      push();
      translate(x * fieldSize + fieldSizeHalf, y * fieldSize + fieldSizeHalf);
      rotate(value.heading());

      let hue = map(value.heading(), -PI, PI, 180, 360);
      stroke(color(hue, 120, 200, 180));
      strokeWeight(1.5);
      line(-fieldSizeHalf + padding, 0, fieldSizeHalf - padding, 0);

      fill(color(hue, 120, 200, 180));
      noStroke();
      triangle(
        fieldSizeHalf - padding,
        0,
        fieldSizeHalf - padding * 2,
        padding * 0.6,
        fieldSizeHalf - padding * 2,
        -padding * 0.6
      );
      pop();
    }
  }

  for (let agent of agents) {
    let x = Math.floor(agent.position.x / fieldSize);
    let y = Math.floor(agent.position.y / fieldSize);
    x = constrain(x, 0, maxCols - 1);
    y = constrain(y, 0, maxRows - 1);

    let desiredDirection = field[x][y];
    agent.follow(desiredDirection);
    agent.update();
    agent.checkBorders();
    agent.draw();
  }

  push();
  let camWidth = 160;
  let camHeight = 120;
  image(video, 10, 10, camWidth, camHeight);

  if (hands.length > 0) {
    for (let hand of hands) {
      let indexTip = hand.index_finger_tip;
      let thumbTip = hand.thumb_tip;

      let scaleX = camWidth / video.width;
      let scaleY = camHeight / video.height;

      fill(0, 100, 255);
      noStroke();
      ellipse(indexTip.x * scaleX + 10, indexTip.y * scaleY + 10, 12);
      ellipse(thumbTip.x * scaleX + 10, thumbTip.y * scaleY + 10, 12);
    }
  }
  pop();
}

function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}

function getHandsData(results) {
  hands = results;
}
