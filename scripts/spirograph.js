(function() {
    "use strict";

    var Hypocycloid = function() {
        this.radius = 250;
        this.corners = 25;
        this.penOffset = 0;
        this.hue = 0;
    };

    Hypocycloid.prototype.draw = function(ctx, cx, cy) {
        var r = this.radius;
        var k = this.corners;
        var o = this.penOffset;

        ctx.beginPath();

        for (var t = 0; t <= Math.PI * 2 + 0.1; t += 0.01) {
            var x = cx + r * (k - 1) * Math.cos(t) + (r + o) * Math.cos((k - 1) * t);
            var y = cy + r * (k - 1) * Math.sin(t) - (r + o) * Math.sin((k - 1) * t);
            ctx.lineTo(x, y);
        }

        ctx.stroke();
    };

    var canvas = document.getElementById("spirograph-canvas");
    var ctx = canvas.getContext("2d");
    var hypocycloid = new Hypocycloid();

    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.lineWidth = 2;

    var redraw = function() {
        ctx.clearRect(0, 0, 1024, 1024);
        hypocycloid.draw(ctx, 512, 512);
        window.requestAnimationFrame(redraw);
    };

    var setupFormEvents = function(form) {
        var f = function() {
            hypocycloid.radius = parseInt(form[0].value);
            hypocycloid.corners = parseInt(form[1].value);
            hypocycloid.penOffset = parseInt(form[2].value);
        };

        form[0].addEventListener("input", f);
        form[1].addEventListener("input", f);
        form[2].addEventListener("input", f);

        f();
    };

    setupFormEvents(document.forms[0]);
    redraw();

}());
