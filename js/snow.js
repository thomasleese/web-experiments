(function() {

  var Flake = function() {
    this.reset();
    this.y = Math.random() * window.innerHeight;
  };

  Flake.prototype.reset = function() {
    this.x = Math.random() * window.innerWidth;
    this.y = -10;
    this.angle = Math.random() * 0.3 + Math.PI / 2 - 0.1;
    this.speed = Math.random() * 2 + 1;
    this.radius = Math.random() * 3 + 1;
  };

  Flake.prototype.tick = function(ctx) {
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);
    this.angle += 0.01 - Math.random() * 0.02;

    //console.log(this.x, this.y);

    if (this.y > window.innerHeight + this.radius) {
      this.reset();
    }

    if (this.x > -this.radius && this.x < window.innerWidth + this.radius) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  var canvas = document.getElementById("snow-canvas");
  var ctx = canvas.getContext("2d");

  var flakes = [];
  for (var i = 0; i < 512; i++) {
    flakes.push(new Flake());
  }

  var resetCanvas = function() {
    ctx.fillStyle = "rgb(255, 255, 255)";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  var redraw = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgb(255, 255, 255)";
    for (var i = flakes.length - 1; i >= 0; i--) {
      flakes[i].tick(ctx);
    }

    requestAnimationFrame(redraw);
  };

  window.addEventListener("resize", resetCanvas);

  resetCanvas();
  redraw();

}());
