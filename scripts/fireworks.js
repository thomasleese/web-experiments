(function() {

  var createColour = function() {
    var h = Math.floor(360 * Math.random());
    return "hsl(" + h + ", 80%, 60%)";
  };

  var playExplosion = function() {
    var i = Math.floor(2 * Math.random());
    var audio = new Audio("sounds/fireworks/explosion" + i + ".wav");
    audio.play();
  };

  var playKick = function() {
    var audio = new Audio("sounds/fireworks/kick.wav");
    audio.play();
  };

  var Particle = function(pos, vel, colour, life) {
    this.pos = pos;
    this.vel = vel;
    this.colour = colour || "rgb(255, 255, 255)";
    this.life = life || 0.8 + 0.6 * Math.random();
  };

  Particle.prototype.update = function(dt) {
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
    this.vel.y += 10 * dt; // gravity
    this.life -= dt;
  };

  Particle.prototype.draw = function(ctx) {
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.pos.x - 1, this.pos.y - 1, 2, 2);
  };

  Particle.prototype.tick = function(ctx, dt) {
    this.update(dt);
    this.draw(ctx);
  };

  var Firework = function(pos, vel) {
    Particle.call(this, pos, vel);
    this.particles = [];
    this.exploded = false;
  };

  Firework.prototype = Object.create(Particle.prototype);

  Firework.prototype.explode = function() {
    var colour = createColour();

    for (var angle = 0; angle <= Math.PI * 4; angle += Math.random() * 0.1) {
      var pos = { x: this.pos.x, y: this.pos.y };
      var r = Math.random() * 200;
      var vel = { x: Math.sin(angle) * r, y: Math.cos(angle) * r };
      vel.x += this.vel.x * 0.25;
      vel.y += this.vel.y * 0.25;

      this.particles.push(new Particle(pos, vel, colour));
    }

    playExplosion();
    this.exploded = true;
  };

  Firework.prototype.tick = function(ctx, dt) {
    if (this.life < 0) {
      if (this.exploded && this.particles.length <= 0) {
        return false; // delete me!
      } else if (!this.exploded) {
        this.explode();
      }
    } else {
      Particle.prototype.tick.call(this, ctx, dt);
    }

    for (var i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].tick(ctx, dt);
      if (this.particles[i].life < 0) {
        this.particles.splice(i, 1);
      }
    }

    return true;
  };

  var FireworkLauncher = function(pos) {
    this.pos = pos;
    this.fireworks = [];
  };

  FireworkLauncher.prototype.launch = function(vel) {
    playKick();
    var pos = { x: this.pos.x, y: this.pos.y };
    this.fireworks.push(new Firework(pos, vel));
  };

  FireworkLauncher.prototype.tick = function(ctx, dt) {
    ctx.fillStyle = "rgb(255, 255, 255)";
    for (var i = this.fireworks.length - 1; i >= 0; i--) {
      if (!this.fireworks[i].tick(ctx, dt)) {
        this.fireworks.splice(i, 1);
      }
    }
  };

  var canvas = document.getElementById("fireworks-canvas");
  var ctx = canvas.getContext("2d");

  var launcher = new FireworkLauncher({
    x: window.innerWidth / 2,
    y: window.innerHeight
  });

  var resetCanvas = function() {
    ctx.fillStyle = "rgb(255, 255, 255)";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    launcher.pos = { x: window.innerWidth / 2, y: window.innerHeight };
  };

  var lastTimestep = 0;

  var tick = function(timestep) {
    var dt = (timestep - lastTimestep) / 1000;
    lastTimestep = timestep;

    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    launcher.tick(ctx, dt);
    requestAnimationFrame(tick);
  };

  var addFirework = function(velX, velY) {
    var vel = {
      x: (velX - canvas.width / 2),
      y: -(canvas.height - velY)
    };

    launcher.launch(vel);
  };

  window.addEventListener("resize", resetCanvas);

  canvas.addEventListener("mousedown", function(e) {
    addFirework(e.pageX, e.pageY);
  });
  canvas.addEventListener("touchdown", function(e) {
    addFirework(e.pageX, e.pageY);
  });

  resetCanvas();
  requestAnimationFrame(tick);

}());
