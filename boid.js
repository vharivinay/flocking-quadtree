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

  align(boids) {
    let perceptionRadius = 50;
    let total = 0;
    let steering = createVector();
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids) {
    let perceptionRadius = 50;
    let total = 0;
    let steering = createVector();
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed * 0.75);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids) {
    let perceptionRadius = 50;
    let total = 0;
    let steering = createVector();
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.mult(1 / (d * d));
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
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
      circle(this.position.x, this.position.y, 50, 50);
    }
  }
}
