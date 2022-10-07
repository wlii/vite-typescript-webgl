var GL;
(function (GL) {
    var Shader = /** @class */ (function () {
        function Shader(name, vertexSource, fragmentSource) {
        }
        Shader.prototype.use = function () {
            gl.useProgram(this._program);
        };
        Object.defineProperty(Shader.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: false,
            configurable: true
        });
        Shader.prototype.loadShader = function (source, shaderType) {
            var shader = gl.createShader(shaderType);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            var error = gl.getShaderInfoLog(shader).trim();
            if (error !== "") {
                throw new Error("Error compiling shader '" + this._name + "': " + error);
            }
            return shader;
        };
        Shader.prototype.createProgram = function (vertexShader, fragmentShader) {
            this._program = gl.createProgram();
            gl.attachShader(this._program, vertexShader);
            gl.attachShader(this._program, fragmentShader);
            gl.linkProgram(this._program);
            var error = gl.getProgramInfoLog(this._program);
            if (error !== "") {
                throw new Error("Error linking shader '" + this._name + "': " + error);
            }
        };
        return Shader;
    }());
    GL.Shader = Shader;
})(GL || (GL = {}));
