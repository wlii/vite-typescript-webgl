var GL;
(function (GL) {
    var Engine = /** @class */ (function () {
        function Engine() {
            this._count = 0;
            console.log(2);
        }
        Engine.prototype.start = function () {
            var _this = this;
            setInterval(function () {
                _this.loop();
            }, 100);
        };
        Engine.prototype.loop = function () {
            this._count++;
            document.title = this._count.toString();
            // requestAnimationFrame(this.loop.bind(this))
            document.title = this._count.toString();
            // this.loop.bind(this)
        };
        return Engine;
    }());
    GL.Engine = Engine;
})(GL || (GL = {}));
window.onload = function () {
    var e = new GL.Engine();
    e.start();
    document.body.innerHTML += "weiweili";
};
