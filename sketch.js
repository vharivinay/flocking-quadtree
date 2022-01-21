const capturer = new CCapture({
  framerate: 60,
  format: 'webm',
  name: 'flocking',
  quality: 100,
  verbose: true,
});
const flock = [];
let enableQtree, QtreeShow, preceptShow, isLoop, isRecording, save;
let p5Canvas;

function setup() {
  p5Canvas = createCanvas(900, 900);

  setupUI();

  for (let i = 0; i < 500; i++) {
    flock.push(new Boid());
  }

  enableQtree = true;
  showQtree = false;
  preceptShow = false;
  isLoop = true;
  isRecording = false;
  save = false;
  freshFrame = true;
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
  let qtree = new QuadTree(boundary, 12);

  for (let boid of flock) {
    let point = new Point(boid.position.x, boid.position.y, boid);
    qtree.insert(point);
    if (showQtree) {
      qtree.show();
    }
  }

  // flock
  for (let boid of flock) {
    if (enableQtree) {
      let range = new Circle(boid.position.x, boid.position.y, 50, 50);
      let points = qtree.query(range);
      let newFlock = [];
      for (let point of points) {
        newFlock.push(point.userData);
      }
      boid.edges();
      boid.flock(newFlock);
      boid.update();
      boid.show(preceptShow);
    } else {
      boid.edges();
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
    //noLoop();
    save = false;
    freshFrame = true;
    capturer.stop();
    capturer.save();
  }

  fps.html('FPS: ' + str(round(frameRate(), 2)));
}
