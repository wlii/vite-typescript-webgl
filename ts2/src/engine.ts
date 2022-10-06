namespace GL {

    export class Engine {

        private _canvas: HTMLCanvasElement;

        public constructor() {
            console.log(2)
        }

        public start(): void {

            this._canvas = GLUtilities.initialize();

            gl.clearColor(0, 0, 0, 1)

            this.loop();
        }

        private loop(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);
            requestAnimationFrame(this.loop.bind(this))
        }

        public resize(): void {
            if (this._canvas !== undefined) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
            }
        }
    }
}