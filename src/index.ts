import { animate } from './js/utility';
import { Control } from './js/control';
import { CanvasContexts, CanvasLayers, Graphics, Layers } from './js/graphics';

window.onload = function() {

  const canvas = {
    under: document.getElementById(Layers.Under),
    main: document.getElementById(Layers.Main),
    over: document.getElementById(Layers.Over)
  } as CanvasLayers;
  const ctx = {
    under: canvas[Layers.Under].getContext('2d'),
    main: canvas[Layers.Main].getContext('2d'),
    over: canvas[Layers.Over].getContext('2d')
  } as CanvasContexts;

  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    Object.values(Layers).forEach(
      (layerName: Layers) => {
        canvas[layerName].width = window.innerWidth;
        canvas[layerName].height = window.innerHeight;
      }
    );
  }

  resizeCanvas();

  animate(200, (current) => {
    ctx[Layers.Under].clearRect(0, 0, canvas[Layers.Under].width, canvas[Layers.Under].height);
    ctx[Layers.Under].fillRect(current, 20, 100, 100);
    return current < 500;
  });

  Graphics.init(canvas, ctx);
  Control.init(canvas[Layers.Main]);

};
