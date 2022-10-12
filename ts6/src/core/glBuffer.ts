import { gl } from './gl';

export class AttributeInfo {

        /**
         * The location of this attribute.
         */
        public location: number;

        /**
         * The size (number of elements) in this attribute (i.e Vector3 = 3).
         */
        public size: number;

        /**
         * The number of elements from the beginning of the buffer.
         */
        public offset: number = 0;
    }

    /**
     * 表示一个 WebGL 缓冲区。
     * */
    export class GLBuffer {

        private _hasAttributeLocation: boolean = false;
        private _elementSize: number;
        private _stride: number;
        private _buffer: WebGLBuffer;

        private _targetBufferType: number;
        private _dataType: number;
        private _mode: number;
        private _typeSize: number;

        private _data: number[] = [];
        private _attributes: AttributeInfo[] = [];

        /**
         * 创建新的 GL 缓冲区。
         * @param dataType 此缓冲区的数据类型。默认值：gl。浮
         * @param targetBufferType 缓冲区目标类型。可以是 gl。ARRAY_BUFFER或gl。ELEMENT_ARRAY_BUFFER。默认值：gl。ARRAY_BUFFER
         * @param mode 此缓冲区的绘制模式。(i.e. gl.TRIANGLES or gl.LINES). 默认值： gl.TRIANGLES
         */
        public constructor(dataType: number = gl.FLOAT, targetBufferType: number = gl.ARRAY_BUFFER, mode: number = gl.TRIANGLES) {
            this._elementSize = 0;
            this._dataType = dataType;
            this._targetBufferType = targetBufferType;
            this._mode = mode;

            // Determine byte size
            switch (this._dataType) {
                case gl.FLOAT:
                case gl.INT:
                case gl.UNSIGNED_INT:
                    this._typeSize = 4;
                    break;
                case gl.SHORT:
                case gl.UNSIGNED_SHORT:
                    this._typeSize = 2;
                    break;
                case gl.BYTE:
                case gl.UNSIGNED_BYTE:
                    this._typeSize = 1;
                    break;
                default:
                    throw new Error("Unrecognized data type: " + dataType.toString());
            }

            this._buffer = gl.createBuffer();
        }

        /**
         * 销毁此缓冲区。
         * */
        public destroy(): void {
            gl.deleteBuffer(this._buffer);
        }

        /**
         * 绑定此缓冲区
         * @param normalized(规范化) 指示是否应规范化数据。默认值：假
         */
        public bind(normalized: boolean = false): void {
            gl.bindBuffer(this._targetBufferType, this._buffer);
   
            if (this._hasAttributeLocation) {
                for (let it of this._attributes) {
                    gl.vertexAttribPointer(it.location, it.size, this._dataType, normalized, this._stride, it.offset * this._typeSize);
                    gl.enableVertexAttribArray(it.location);
                }
            }
        }

        /**
         * 解除此缓冲区的绑定。
         * */
        public unbind(): void {
            for (let it of this._attributes) {
                gl.disableVertexAttribArray(it.location);
            }

            gl.bindBuffer(this._targetBufferType, undefined);
        }

        /**
         * 将包含所提供信息的属性添加到此缓冲区。
         * @param info 要添加的信息。
         */
        public addAttributeLocation(info: AttributeInfo): void {
console.log(info)
            this._hasAttributeLocation = true;
            info.offset = this._elementSize;
            this._attributes.push(info);
            this._elementSize += info.size;
            this._stride = this._elementSize * this._typeSize;
        }

        /**
         * 将此缓冲区中的当前数据替换为提供的数据。
         * @param data 要加载到此缓冲区中的数据。
         */


        //将数据添加到此缓冲区。
        public pushBackData(data: number[]): void {
            for (let d of data) {
                this._data.push(d);
            }
            console.log(this._data)
            //输出=> [0, 0, 0, 0, 0.5, 0, 0.5, 0.5, 0]
        }

        //将此缓冲区的数据上传到 GPU。
        public upload(): void {
        	
            gl.bindBuffer(this._targetBufferType, this._buffer);
            
			//this._targetBufferType: 输出 =>34962
			//this._buffer: 输出 =>WebGLBuffer {}

            let bufferData: ArrayBuffer;
            
            console.log(this._dataType)
            
            switch (this._dataType) {
                case gl.FLOAT:
                    bufferData = new Float32Array(this._data);
                    break;
                case gl.INT:
                    bufferData = new Int32Array(this._data);
                    break;
                case gl.UNSIGNED_INT:
                    bufferData = new Uint32Array(this._data);
                    break;
                case gl.SHORT:
                    bufferData = new Int16Array(this._data);
                    break;
                case gl.UNSIGNED_SHORT:
                    bufferData = new Uint16Array(this._data);
                    break;
                case gl.BYTE:
                    bufferData = new Int8Array(this._data);
                    break;
                case gl.UNSIGNED_BYTE:
                    bufferData = new Uint8Array(this._data);
                    break;
            }

			console.log(bufferData)
            gl.bufferData(this._targetBufferType, bufferData, gl.STATIC_DRAW);
            
            
        }

        /**
         * Draws this buffer.
         * */
        public draw(): void {
            if (this._targetBufferType === gl.ARRAY_BUFFER) {
                gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
            } else if (this._targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
                gl.drawElements(this._mode, this._data.length, this._dataType, 0);
            }
        }
    }

//tsc --out main.js ./src/app.ts ./src/engine.ts ./src/core/gl.ts ./src/core/shader.ts ./src/core/glBuffer.ts ./src/graphics/sprite.ts ./src/math/matrix4x4.ts
