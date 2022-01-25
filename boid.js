class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 5;
    this.velocity.setMag(
      random(
        random(-this.maxSpeed / 2, this.maxSpeed / 2),
        random(-this.maxSpeed / 2, this.maxSpeed / 2)
      )
    );
  }

  edges(boundaryType) {
    if (boundaryType === 'Unbound') {
      if (this.position.x > width) {
        this.position.x = 0;
      } else if (this.position.x < 0) {
        this.position.x = width;
      }
      if (this.position.y > height) {
        this.position.y = 0;
      } else if (this.position.y < 0) {
        this.position.y = height;
      }
    } else if (boundaryType === 'Bound') {
      if (this.position.x > width || this.position.x < 0) {
        this.velocity.x *= -1;
      } else if (this.position.y > height || this.position.y < 0) {
        this.velocity.y *= -1;
      }
    }
  }

  flock(boids) {
    let perceptionRadius = perceptSlider.value();
    let total = 0;
    let toAlign = createVector();
    let toGroup = createVector();
    let toSeperate = createVector();

    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );

      if (other != this && d < perceptionRadius) {
        // Alignment
        toAlign.add(other.velocity);
        // Chohesion
        toGroup.add(other.position);
        // Separation
        let diff = p5.Vector.sub(this.position, other.position);
        diff.mult(1 / (d * d));
        toSeperate.add(diff);
        total++;
      }
    }
    if (total > 0) {
      toAlign.div(total);
      toAlign.setMag(this.maxSpeed);
      toAlign.sub(this.velocity);
      toAlign.limit(this.maxForce);
      toGroup.div(total);
      toGroup.sub(this.position);
      toGroup.setMag(this.maxSpeed * 0.75);
      toGroup.sub(this.velocity);
      toGroup.limit(this.maxForce);
      toSeperate.div(total);
      toSeperate.setMag(this.maxSpeed);
      toSeperate.sub(this.velocity);
      toSeperate.limit(this.maxForce);
    }

    toAlign.mult(alignSlider.value());
    toGroup.mult(cohesionSlider.value());
    toSeperate.mult(separationSlider.value());

    this.acceleration.add(toAlign);
    this.acceleration.add(toGroup);
    this.acceleration.add(toSeperate);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.set(0, 0);
  }

  show(percept) {
    strokeWeight(2);
    stroke(255);
    point(this.position.x, this.position.y);
    if (percept) {
      rectMode(CENTER);
      noFill();
      strokeWeight(1);
      stroke(0, 255, 0);
      circle(
        this.position.x,
        this.position.y,
        perceptSlider.value(),
        perceptSlider.value()
      );
    }
  }
}
