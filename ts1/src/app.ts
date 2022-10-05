namespace GL {

    export class Engine {

        private _count: number = 0;

        public constructor() {
            console.log(2)
        }

        public start(): void {
            this.loop();
        }

        private loop(): void {
            this._count++;
            document.title = this._count.toString();
            requestAnimationFrame(this.loop.bind(this))
        }
    }
}
window.onload = function () {
    let e = new GL.Engine();
    e.start()
    document.body.innerHTML += "weiweili";
}