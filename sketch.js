const capturer = new CCapture({
  framerate: 60,
  format: 'webm',
  name: 'flocking',
  quality: 100,
  verbose: true,
});
const flock = [];
let enableQtree, QtreeShow, preceptShow, boundaryType;
let isLoop, isRecording, save;
let p5Canvas;

function setup() {
  p5Canvas = createCanvas(800, 800);
  p5Canvas.parent('sketch-holder');

  setupUI();

  for (let i = 0; i < 500; i++) {
    flock.push(new Boid());
  }

  optimize = true;
  showQtree = false;
  preceptShow = false;
  isLoop = true;
  isRecording = false;
  save = false;
  freshFrame = true;
  boundaryType = 'Unbound';
}

function draw() {
  if (isRecording && freshFrame) {
    freshFrame = false;
    capturer.start();
  }

  background(51, 50);

  numOfBoids();

  // Make quadtree
  let boundary = new Rectangle(width / 2, height / 2, width, height);
  for (i = 0; i < qtreeCapacity.length; i++) {
    if (qtreeCapacity[i].checked) {
      var capacity = qtreeCapacity[i].value;
    }
  }
  let qtree = new QuadTree(boundary, capacity);

  for (let boid of flock) {
    let point = new Point(boid.position.x, boid.position.y, boid);
    qtree.insert(point);
    if (showQtree) {
      qtree.show();
    }
  }

  for (i = 0; i < bounding.length; i++) {
    if (bounding[i].checked) {
      var bounding_value = bounding[i].value;
    }
  }

  // flock
  for (let boid of flock) {
    if (enableQtree.checked()) {
      let range = new Circle(boid.position.x, boid.position.y, 50, 50);
      let points = qtree.query(range);
      let newFlock = [];
      for (let point of points) {
        newFlock.push(point.userData);
      }
      boid.edges(bounding_value);
      boid.flock(newFlock);
      boid.update();
      boid.show(preceptShow);
    } else {
      boid.edges(bounding_value);
      boid.flock(flock);
      boid.update();
      boid.show(preceptShow);
    }
  }
  qtree.clear();

  if (isRecording) {
    capturer.capture(p5Canvas.canvas);
  }

  if (save && !isRecording) {
    save = false;
    freshFrame = true;
    capturer.stop();
    capturer.save();
  }
}
