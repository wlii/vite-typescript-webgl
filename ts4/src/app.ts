var engine:GL.Engine;

window.onload = function () {

    engine = new GL.Engine();

    engine.start()
    
}

window.onresize = function () {
    engine.resize();
    console.log(1)
}