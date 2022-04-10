let alignSlider, cohesionSlider, separationSlider, numBoids, perceptSlider;
let alignText, cohesionText, separationText, perceptText, boidText, count, fps;
let checkbox, showQtree, showPercept, button, record;
let bounding, boundingTitle, qtreeCapacity, qtreeCapacityTitle;
let sourceCode;

function setupUI() {
  // Check Boxes
  enableQtree = select('#enableQtree');
  enableQtree.changed(toOptimize);

  showQtree = select('#showQtree');
  showQtree.changed(displayQtree);

  showPercept = select('#showPercept');
  showPercept.changed(displayPercept);

  // Radio Buttons
  bounding = document.getElementsByName('boundaryType');
  qtreeCapacity = document.getElementsByName('qtreeCapacity');

  // Normal Buttons
  button = select('#toggleLoop');
  button.mousePressed(toggleLoop);
  record = select('#record');
  record.mousePressed(toggleRecord);

  // Sliders
  numBoids = select('#numBoids');
  alignSlider = select('#alignSlider');
  cohesionSlider = select('#cohesionSlider');
  separationSlider = select('#separationSlider');
  perceptSlider = select('#perceptionRadius');
}

function toOptimize() {
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
}
