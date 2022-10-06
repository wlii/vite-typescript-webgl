var engine;
window.onload = function () {
    engine = new GL.Engine();
    engine.start();
};
window.onresize = function () {
    engine.resize();
    console.log(1501);
};
var GL;
(function (GL) {
    var Engine = /** @class */ (function () {
        function Engine() {
            console.log(2);
        }
        Engine.prototype.start = function () {
            this._canvas = GL.GLUtilities.initialize();
            GL.gl.clearColor(0, 0, 0, 1);
            this.loop();
        };
        Engine.prototype.loop = function () {
            GL.gl.clear(GL.gl.COLOR_BUFFER_BIT);
            requestAnimationFrame(this.loop.bind(this));
        };
        Engine.prototype.resize = function () {
            if (this._canvas !== undefined) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
            }
        };
        return Engine;
    }());
    GL.Engine = Engine;
})(GL || (GL = {}));
var GL;
(function (GL) {
    var GLUtilities = /** @class */ (function () {
        function GLUtilities() {
        }
        GLUtilities.initialize = function (elementId) {
            var canvas;
            if (elementId !== undefined) {
                canvas = document.getElementById(elementId);
                if (canvas === undefined) {
                    throw new Error("Cannot find a canvas element named :" + elementId);
                }
            }
            else {
                canvas = document.createElement("canvas");
                document.body.appendChild(canvas);
            }
            GL.gl = canvas.getContext("webgl");
            if (GL.gl === undefined) {
                throw new Error("Unable to initialize WebGL!");
            }
            return canvas;
        };
        return GLUtilities;
    }());
    GL.GLUtilities = GLUtilities;
})(GL || (GL = {}));
