(function() {

  var Flake = function() {
    this.radius = Math.random() * 3 + 1;

    this.pos = {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    };

    this.velocity = { x: 0, y: 0 };
  };

  Flake.prototype.wrapValues = function() {
    var v = this.radius * 0.9;
    this.velocity.y = Math.min(this.velocity.y, v);
    this.velocity.x = Math.min(Math.max(this.velocity.x, -v / 5), v / 5);

    var height = window.innerHeight + this.radius * 2;
    if (this.pos.y > window.innerHeight + this.radius) {
      this.pos.y -= height;
    }

    var width = window.innerWidth + this.radius * 2;
    if (this.pos.x < -this.radius) {
      this.pos.x += width;
    }

    if (this.pos.x > window.innerWidth + this.radius) {
      this.pos.x -= width;
    }
  };

  Flake.prototype.tick = function(ctx) {
    this.velocity.y += 0.4 - 0.5 * Math.random();
    this.velocity.x += 0.05 - 0.1 * Math.random();
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;

    this.wrapValues();

    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
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
