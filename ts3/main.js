var engine;
window.onload = function () {
    engine = new GL.Engine();
    engine.start();
};
window.onresize = function () {
    engine.resize();
    console.log(1);
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
            this.loadShaders();
            this._shader.use();
            this.createBuffer();
            this.loop();
            this.resize();
        };
        Engine.prototype.loop = function () {
            GL.gl.clear(GL.gl.COLOR_BUFFER_BIT); // 使用颜色缓冲区中的颜色，每次刷新
            GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, this._buffer);
            var positionLocation = this._shader.getAttributeLocation("a_position");
            GL.gl.vertexAttribPointer(positionLocation, 3, GL.gl.FLOAT, false, 0, 0);
            GL.gl.enableVertexAttribArray(positionLocation);
            GL.gl.drawArrays(GL.gl.TRIANGLES, 0, 3);
            requestAnimationFrame(this.loop.bind(this));
        };
        Engine.prototype.resize = function () {
            if (this._canvas !== undefined) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
                GL.gl.viewport(0, 0, this._canvas.width, this._canvas.height);
            }
        };
        Engine.prototype.createBuffer = function () {
            this._buffer = GL.gl.createBuffer();
            var vertices = [
                0, 0, 0,
                0, 0.5, 0,
                0.5, 0.5, 0
            ];
            GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, this._buffer);
            GL.gl.bufferData(GL.gl.ARRAY_BUFFER, new Float32Array(vertices), GL.gl.STATIC_DRAW);
            var positionLocation = this._shader.getAttributeLocation("a_position");
            GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, undefined);
            GL.gl.disableVertexAttribArray(positionLocation);
        };
        Engine.prototype.loadShaders = function () {
            var vertexShaderSource = "\n                attribute vec3 a_position;\n\n                void main() {\n                    gl_Position = vec4(a_position, 1.0);\n                }\n                ";
            var fragmentShaderSource = "\n                precision mediump float;\n\n                void main() {\n                    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n                }\n                ";
            this._shader = new GL.Shader("base", vertexShaderSource, fragmentShaderSource);
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
var GL;
(function (GL) {
    var Shader = /** @class */ (function () {
        function Shader(name, vertexSource, fragmentSource) {
            this._attributes = {};
            this._uniforms = {};
            this._name = name;
            var vertexShader = this.loadShader(vertexSource, GL.gl.VERTEX_SHADER);
            var fragmentShader = this.loadShader(fragmentSource, GL.gl.FRAGMENT_SHADER);
            this.createProgram(vertexShader, fragmentShader);
            this.detectAttributes();
            this.detectUniforms();
        }
        Shader.prototype.detectUniforms = function () {
            var uniformCount = GL.gl.getProgramParameter(this._program, GL.gl.ACTIVE_UNIFORMS);
            // console.log("detectUniforms:" + uniformCount)
            for (var i = 0; i < uniformCount; ++i) {
                var info = GL.gl.getActiveUniform(this._program, i);
                if (!info) {
                    break;
                }
                this._uniforms[info.name] = GL.gl.getUniformLocation(this._program, info.name);
            }
        };
        Shader.prototype.detectAttributes = function () {
            var attributeCount = GL.gl.getProgramParameter(this._program, GL.gl.ACTIVE_ATTRIBUTES);
            console.log(this._program);
            console.log("gl.ACTIVE_ATTRIBUTES:" + GL.gl.ACTIVE_ATTRIBUTES);
            console.log("detectAttributes:" + attributeCount);
            for (var i = 0; i < attributeCount; ++i) {
                var info = GL.gl.getActiveAttrib(this._program, i);
                if (!info) {
                    break;
                }
                this._attributes[info.name] = GL.gl.getAttribLocation(this._program, info.name);
            }
        };
        Shader.prototype.getAttributeLocation = function (name) {
            console.log("getAttributeLocation:" + name);
            if (this._attributes[name] === undefined) {
                throw new Error("Unable to find attribute named '".concat(name, "' in shader named '").concat(this._name, "'"));
            }
            return this._attributes[name];
        };
        Shader.prototype.getUniformLocation = function (name) {
            console.log("getUniformLocation:" + name);
            if (this._uniforms[name] === undefined) {
                throw new Error("Unable to find uniform named '".concat(name, "' in shader named '").concat(this._name, "'"));
            }
            return this._uniforms[name];
        };
        Shader.prototype.use = function () {
            GL.gl.useProgram(this._program);
        };
        // public get name():string {
        //     return this._name;
        // }
        Shader.prototype.loadShader = function (source, shaderType) {
            var shader = GL.gl.createShader(shaderType);
            GL.gl.shaderSource(shader, source);
            GL.gl.compileShader(shader);
            var error = GL.gl.getShaderInfoLog(shader).trim();
            if (error !== "") {
                throw new Error("Error compiling shader '" + this._name + "': " + error);
            }
            return shader;
        };
        Shader.prototype.createProgram = function (vertexShader, fragmentShader) {
            this._program = GL.gl.createProgram();
            GL.gl.attachShader(this._program, vertexShader);
            GL.gl.attachShader(this._program, fragmentShader);
            GL.gl.linkProgram(this._program);
            var error = GL.gl.getProgramInfoLog(this._program);
            if (error !== "") {
                throw new Error("Error linking shader '" + this._name + "': " + error);
            }
        };
        return Shader;
    }());
    GL.Shader = Shader;
})(GL || (GL = {}));
