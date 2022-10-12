import { Engine } from './core/engine';

var engine;
window.onload = function () {
    engine = new Engine();
    engine.start()
}

window.onresize = function () {
    engine.resize();
}