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
        /**
         * 构造函数
         */
        function Engine() {
            this._count = 0;
        }
        /**
         * Start up 函数
         */
        Engine.prototype.start = function () {
            this._canvas = GL.GLUtilities.initialize();
            GL.gl.clearColor(1, 0, 0, 1); // 设置红色
            this.loadShaders(); //初始化着色器
            this._shader.use(); //将定义好的WebGLProgram 对象添加到当前的渲染状态中
            this.craeteBuffer(); //绘制三角形
            this.resize();
            this.loop();
        };
        Engine.prototype.craeteBuffer = function () {
            this._buffer = new GL.GLBuffer();
            var positionArribute = new GL.AttributeInfo();
            positionArribute.location = this._shader.getAttributeLocation("a_position");
            positionArribute.offset = 0;
            positionArribute.size = 3;
            this._buffer.addAttributeLocation(positionArribute);
            var vertices = [
                // x, y, z
                0, 0, 0,
                0, 0.5, 0,
                0.5, 0.5, 0
            ];
            this._buffer.pushBackData(vertices);
            this._buffer.upload();
            this._buffer.unbind();
        };
        /**
         * 游戏主循环
         */
        Engine.prototype.loop = function () {
            GL.gl.clear(GL.gl.COLOR_BUFFER_BIT); // 使用颜色缓冲区中的颜色，每次刷新
            // set uniform 
            var colorPosition = this._shader.getUniformLocation("u_color");
            GL.gl.uniform4f(colorPosition, 1, 0.5, 0, 1);
            this._buffer.bind();
            this._buffer.draw();
            requestAnimationFrame(this.loop.bind(this));
        };
        /**
         * Resizes the canvas to fit the window.
         * */
        Engine.prototype.resize = function () {
            if (this._canvas !== undefined) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
            }
            GL.gl.viewport(0, 0, window.innerWidth, window.innerHeight);
        };
        Engine.prototype.loadShaders = function () {
            var vertexShaderSource = "\n\t\t\tattribute vec3 a_position;\n\t\t\t\n\t\t\tvoid main() {\n\t\t\t    gl_Position = vec4(a_position, 1.0);\n\t\t\t}";
            var fragmentShaderSource = "\n\t\t\tprecision mediump float;\n\t\t\tuniform vec4 u_color;\n\t\t\t\n\t\t\tvoid main() {\n\t\t\t    gl_FragColor = u_color;\n\t\t\t}";
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
        //检测统一类型
        Shader.prototype.detectUniforms = function () {
            var uniformCount = GL.gl.getProgramParameter(this._program, GL.gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < uniformCount; ++i) {
                var info = GL.gl.getActiveUniform(this._program, i);
                if (!info) {
                    break;
                }
                this._uniforms[info.name] = GL.gl.getUniformLocation(this._program, info.name);
                //输出=>{u_color: WebGLUniformLocation}
            }
        };
        //检测属性
        Shader.prototype.detectAttributes = function () {
            var attributeCount = GL.gl.getProgramParameter(this._program, GL.gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < attributeCount; ++i) {
                var info = GL.gl.getActiveAttrib(this._program, i);
                if (!info) {
                    break;
                }
                this._attributes[info.name] = GL.gl.getAttribLocation(this._program, info.name);
                //输出=>{a_position: 0}
            }
        };
        //获取属性位置
        Shader.prototype.getAttributeLocation = function (name) {
            if (this._attributes[name] === undefined) {
                throw new Error("Unable to find attribute named '".concat(name, "' in shader named '").concat(this._name, "'"));
            }
            return this._attributes[name];
            //输出=>{a_position: 0}
        };
        //获取统一类型位置
        Shader.prototype.getUniformLocation = function (name) {
            if (this._uniforms[name] === undefined) {
                throw new Error("Unable to find uniform named '".concat(name, "' in shader named '").concat(this._name, "'"));
            }
            return this._uniforms[name];
            //输出=> {u_color: WebGLUniformLocation}
        };
        //WebGLRenderingContext.useProgram() 方法将定义好的WebGLProgram 对象添加到当前的渲染状态中。
        Shader.prototype.use = function () {
            GL.gl.useProgram(this._program);
        };
        // public get name():string {
        //     return this._name;
        // }
        //装载定点着色器、片段着色器
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
var GL;
(function (GL) {
    /**
     * Represents the information needed for a GLBuffer attribute.
     * */
    var AttributeInfo = /** @class */ (function () {
        function AttributeInfo() {
            /**
             * The number of elements from the beginning of the buffer.
             */
            this.offset = 0;
        }
        return AttributeInfo;
    }());
    GL.AttributeInfo = AttributeInfo;
    /**
     * Represents a WebGL buffer.
     * */
    var GLBuffer = /** @class */ (function () {
        /**
         * Creates a new GL buffer.
         * @param dataType The data type of this buffer. Default: gl.FLOAT
         * @param targetBufferType The buffer target type. Can be either gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER. Default: gl.ARRAY_BUFFER
         * @param mode The drawing mode of this buffer. (i.e. gl.TRIANGLES or gl.LINES). Default: gl.TRIANGLES
         */
        function GLBuffer(dataType, targetBufferType, mode) {
            if (dataType === void 0) { dataType = GL.gl.FLOAT; }
            if (targetBufferType === void 0) { targetBufferType = GL.gl.ARRAY_BUFFER; }
            if (mode === void 0) { mode = GL.gl.TRIANGLES; }
            this._hasAttributeLocation = false;
            this._data = [];
            this._attributes = [];
            this._elementSize = 0;
            this._dataType = dataType;
            this._targetBufferType = targetBufferType;
            this._mode = mode;
            // Determine byte size
            switch (this._dataType) {
                case GL.gl.FLOAT:
                case GL.gl.INT:
                case GL.gl.UNSIGNED_INT:
                    this._typeSize = 4;
                    break;
                case GL.gl.SHORT:
                case GL.gl.UNSIGNED_SHORT:
                    this._typeSize = 2;
                    break;
                case GL.gl.BYTE:
                case GL.gl.UNSIGNED_BYTE:
                    this._typeSize = 1;
                    break;
                default:
                    throw new Error("Unrecognized data type: " + dataType.toString());
            }
            this._buffer = GL.gl.createBuffer();
        }
        /**
         * Destroys this buffer.
         * */
        GLBuffer.prototype.destroy = function () {
            GL.gl.deleteBuffer(this._buffer);
        };
        /**
         * Binds this buffer.
         * @param normalized Indicates if the data should be normalized. Default: false
         */
        GLBuffer.prototype.bind = function (normalized) {
            if (normalized === void 0) { normalized = false; }
            GL.gl.bindBuffer(this._targetBufferType, this._buffer);
            if (this._hasAttributeLocation) {
                for (var _i = 0, _a = this._attributes; _i < _a.length; _i++) {
                    var it = _a[_i];
                    GL.gl.vertexAttribPointer(it.location, it.size, this._dataType, normalized, this._stride, it.offset * this._typeSize);
                    GL.gl.enableVertexAttribArray(it.location);
                }
            }
        };
        /**
         * Unbinds this buffer.
         * */
        GLBuffer.prototype.unbind = function () {
            for (var _i = 0, _a = this._attributes; _i < _a.length; _i++) {
                var it = _a[_i];
                GL.gl.disableVertexAttribArray(it.location);
            }
            GL.gl.bindBuffer(this._targetBufferType, undefined);
        };
        /**
         * Adds an attribute with the provided information to this buffer.
         * @param info The information to be added.
         */
        GLBuffer.prototype.addAttributeLocation = function (info) {
            console.log(info);
            this._hasAttributeLocation = true;
            info.offset = this._elementSize;
            this._attributes.push(info);
            this._elementSize += info.size;
            this._stride = this._elementSize * this._typeSize;
        };
        /**
         * Replaces the current data in this buffer with the provided data.
         * @param data The data to be loaded in this buffer.
         */
        /**
         * Adds data to this buffer.
         * @param data
         */
        GLBuffer.prototype.pushBackData = function (data) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var d = data_1[_i];
                this._data.push(d);
            }
            console.log(this._data);
            //输出=> [0, 0, 0, 0, 0.5, 0, 0.5, 0.5, 0]
        };
        /**
         * Clears out all data in this buffer.
         * */
        /**
         * Uploads this buffer's data to the GPU.
         * */
        GLBuffer.prototype.upload = function () {
            GL.gl.bindBuffer(this._targetBufferType, this._buffer);
            //this._targetBufferType: 输出 =>34962
            //this._buffer: 输出 =>WebGLBuffer {}
            var bufferData;
            console.log(this._dataType);
            switch (this._dataType) {
                case GL.gl.FLOAT:
                    bufferData = new Float32Array(this._data);
                    break;
                case GL.gl.INT:
                    bufferData = new Int32Array(this._data);
                    break;
                case GL.gl.UNSIGNED_INT:
                    bufferData = new Uint32Array(this._data);
                    break;
                case GL.gl.SHORT:
                    bufferData = new Int16Array(this._data);
                    break;
                case GL.gl.UNSIGNED_SHORT:
                    bufferData = new Uint16Array(this._data);
                    break;
                case GL.gl.BYTE:
                    bufferData = new Int8Array(this._data);
                    break;
                case GL.gl.UNSIGNED_BYTE:
                    bufferData = new Uint8Array(this._data);
                    break;
            }
            console.log(bufferData);
            GL.gl.bufferData(this._targetBufferType, bufferData, GL.gl.STATIC_DRAW);
        };
        /**
         * Draws this buffer.
         * */
        GLBuffer.prototype.draw = function () {
            if (this._targetBufferType === GL.gl.ARRAY_BUFFER) {
                GL.gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
            }
            else if (this._targetBufferType === GL.gl.ELEMENT_ARRAY_BUFFER) {
                GL.gl.drawElements(this._mode, this._data.length, this._dataType, 0);
            }
        };
        return GLBuffer;
    }());
    GL.GLBuffer = GLBuffer;
})(GL || (GL = {}));
//tsc --out main.js ./src/app.ts ./src/engine.ts ./src/core/gl.ts ./src/core/shader.ts ./src/core/glBuffer.ts
