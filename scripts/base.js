(function() {
    "use strict";

    // polyfill based on https://gist.github.com/paulirish/1579671
    var requestAnimationFramePolyfill = function() {
        var lastTime = 0;

        return function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);

            return window.setTimeout(function() {
                lastTime = nextTime;
                callback(lastTime);
            }, nextTime - now);
        };
    };

    window.requestAnimationFrame = window.requestAnimationFrame ||
                                   window.mozRequestAnimationFrame ||
                                   window.webkitRequestAnimationFrame ||
                                   window.msRequestAnimationFrame ||
                                   window.oRequestAnimationFrame ||
                                   requestAnimationFramePolyfill();

}());
