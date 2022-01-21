let alignSlider, cohesionSlider, separationSlider, numBoids;
let alignText, cohesionText, seperationText, boidText, count, fps;
let checkbox, showQtree, showPercept, button, record;

function setupUI() {
  enableQtree = createCheckbox('Optimize', true);
  enableQtree.position(width + 20, 20);
  enableQtree.changed(myCheckedEvent);

  showQtree = createCheckbox('ShowQtree', false);
  showQtree.position(width + 20, 40);
  showQtree.changed(displayQtree);

  showPercept = createCheckbox('ShowPercept', false);
  showPercept.position(width + 20, 60);
  showPercept.changed(displayPercept);

  button = createButton('Toggle Loop');
  button.position(width + 20, height - 100);
  button.size(140, 80);
  button.mousePressed(toggleLoop);

  record = createButton('Toggle Record');
  record.position(width + 20, height - 200);
  record.size(140, 80);
  record.mousePressed(toggleRecord);

  boidText = createP('Number of Boids');
  boidText.style('font-size', '16px');
  boidText.position(width + 20, 80);
  numBoids = createSlider(3, 1000, 500, 25);
  numBoids.position(width + 20, 120);

  count = createP(str(numBoids.value()));
  count.style('font-size', '16px');
  count.position(width + 160, 105);

  alignText = createP('Align Slider');
  alignText.style('font-size', '16px');
  alignText.position(width + 20, 140);
  alignSlider = createSlider(0, 2, 1, 0.1);
  alignSlider.position(width + 20, 180);

  cohesionText = createP('Cohesion Slider');
  cohesionText.style('font-size', '16px');
  cohesionText.position(width + 20, 200);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  cohesionSlider.position(width + 20, 240);

  seperationText = createP('Seperation Slider');
  seperationText.style('font-size', '16px');
  seperationText.position(width + 20, 260);
  separationSlider = createSlider(0, 2, 1, 0.1);
  separationSlider.position(width + 20, 300);

  fps = createP('FPS: ');
  fps.style('font-size', '16px', 'font-weight', 'bold');
  fps.position(width + 20, 320);
}

function myCheckedEvent() {
  if (this.checked()) {
    return (optimize = true);
  } else {
    return (optimize = false);
  }
}

function displayQtree() {
  if (this.checked()) {
    return (showQtree = true);
  } else {
    return (showQtree = false);
  }
}

function displayPercept() {
  if (this.checked()) {
    return (preceptShow = true);
  } else {
    return (preceptShow = false);
  }
}

function toggleLoop() {
  if (isLoop) {
    noLoop();
    isLoop = false;
  } else {
    loop();
    isLoop = true;
  }
}

function toggleRecord() {
  if (isRecording) {
    isRecording = false;
    save = true;
  } else {
    isRecording = true;
    save = false;
  }
}

function numOfBoids() {
  let diff;
  if (flock.length > numBoids.value()) {
    diff = flock.length - numBoids.value();
    flock.splice(0, diff);
  } else if (flock.length < numBoids.value()) {
    diff = numBoids.value() - flock.length;
    for (let i = 0; i < diff; i++) {
      flock.push(new Boid());
    }
  }
  count.html(str(numBoids.value()));
}
