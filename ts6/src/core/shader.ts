import { gl } from './gl';

export class Shader{
        private _name : string;
        private _program: WebGLProgram;
        private _attributes: { [name: string]: number } = {};
        private _uniforms: { [name: string]: WebGLUniformLocation } = {};

        public constructor(name:string, vertexSource:string,fragmentSource:string){
            this._name = name;
            let vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
            let fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);

            this.createProgram(vertexShader, fragmentShader);

            this.detectAttributes();
            this.detectUniforms();
        }

		//检测统一类型
        private detectUniforms(): void {
            let uniformCount = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < uniformCount; ++i) {
                let info: WebGLActiveInfo = gl.getActiveUniform(this._program, i);
                if (!info) {
                    break;
                }
                this._uniforms[info.name] = gl.getUniformLocation(this._program, info.name);
                //输出=>{u_color: WebGLUniformLocation}
            }
        }

		//检测属性
        private detectAttributes(): void {
            let attributeCount = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
            
            for (let i = 0; i < attributeCount; ++i) {
                let info: WebGLActiveInfo = gl.getActiveAttrib(this._program, i);
                if (!info) {
                    break;
                }
                this._attributes[info.name] = gl.getAttribLocation(this._program, info.name);
                //输出=>{a_position: 0}
            }
        }

		//获取属性位置
        public getAttributeLocation(name: string): number {
            if (this._attributes[name] === undefined) {
                throw new Error(`Unable to find attribute named '${name}' in shader named '${this._name}'`);
            }
            return this._attributes[name];
            //输出=>{a_position: 0}
        }

		//获取统一类型位置
        public getUniformLocation(name: string): WebGLUniformLocation {
            if (this._uniforms[name] === undefined) {
                throw new Error(`Unable to find uniform named '${name}' in shader named '${this._name}'`);
            }

            return this._uniforms[name]; 
            //输出=> {u_color: WebGLUniformLocation}
        }

		//WebGLRenderingContext.useProgram() 方法将定义好的WebGLProgram 对象添加到当前的渲染状态中。
        public use():void{
            gl.useProgram(this._program);
        }

       public get name():string {
           return this._name;
       }

		//装载定点着色器、片段着色器
        private loadShader(source:string,shaderType:number):WebGLShader{
            let shader:WebGLShader = gl.createShader(shaderType)
            gl.shaderSource(shader,source);
            gl.compileShader(shader);
            let  error = gl.getShaderInfoLog(shader).trim();
            if(error !== ""){
                throw new Error("Error compiling shader '" + this._name + "': " + error);
            }
            return shader;
        }

        private createProgram(vertexShader:WebGLShader,fragmentShader:WebGLShader):void{
            this._program = gl.createProgram();
            gl.attachShader(this._program, vertexShader);
            gl.attachShader(this._program, fragmentShader);
            gl.linkProgram(this._program);
       
            let error = gl.getProgramInfoLog(this._program);
            if(error !== ""){
                throw new Error("Error linking shader '" + this._name + "': " + error );
            }
        }
    }