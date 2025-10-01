let handpose;
let video;
let hands = [];

const fieldSize = 50;
const maxCols = Math.ceil(innerWidth / fieldSize);
const maxRows = Math.ceil(innerHeight / fieldSize);
const divider = 4;
let field;
let agents = [];

class Agent {
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y);
    this.lastPosition = this.position.copy();
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
    this.lastPosition = this.position.copy();
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  checkBorders() {
    if (this.position.x < 0) {
      this.position.x = innerWidth;
      this.lastPosition.x = innerWidth;
    } else if (this.position.x > innerWidth) {
      this.position.x = 0;
      this.lastPosition.x = 0;
    }
    if (this.position.y < 0) {
      this.position.y = innerHeight;
      this.lastPosition.y = innerHeight;
    } else if (this.position.y > innerHeight) {
      this.position.y = 0;
      this.lastPosition.y = 0;
    }
  }

  draw() {
    push();
    stroke(this.col);
    strokeWeight(1.5);
    line(
      this.lastPosition.x,
      this.lastPosition.y,
      this.position.x,
      this.position.y
    );
    pop();
  }
}


function preload() {
  handpose = ml5.handPose();
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  background(255);

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
      const value = noise(x / divider, y / divider) * TWO_PI;
      field[x].push(p5.Vector.fromAngle(value));
    }
  }
  return field;
}

function generateAgents() {
  for (let i = 0; i < 200; i++) {
    let agent = new Agent(
      Math.random() * innerWidth,
      Math.random() * innerHeight,
      4,
      0.1
    );
    agents.push(agent);
  }
}

function draw() {
  let handClosed = false;
  if (hands.length > 0) {
    let indexTip = hands[0].index_finger_tip;
    let thumbTip = hands[0].thumb_tip;
    let distance = dist(indexTip.x, indexTip.y, thumbTip.x, thumbTip.y);
    if (distance < 40) handClosed = true;
  }

  for (let agent of agents) {
    let x = Math.floor(agent.position.x / fieldSize);
    let y = Math.floor(agent.position.y / fieldSize);
    x = constrain(x, 0, maxCols - 1);
    y = constrain(y, 0, maxRows - 1);

    let desiredDirection = field[x][y];

    if (handClosed) desiredDirection.rotate(0.1);

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

      fill(0, 0, 255);
      noStroke();
      ellipse(indexTip.x * scaleX + 10, indexTip.y * scaleY + 10, 10);
      ellipse(thumbTip.x * scaleX + 10, thumbTip.y * scaleY + 10, 10);
    }
  }
  pop();
}

function getHandsData(results) {
  hands = results;
}
