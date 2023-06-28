import { animate } from './js/utility';
import { Control } from './js/control';
import { CanvasContexts, CanvasLayers, Graphics, Layers } from './js/graphics';

window.onload = function() {

  const canvas = {
    main: document.getElementById(Layers.Main)
  } as CanvasLayers;
  const ctx = {
    main: canvas[Layers.Main].getContext('2d')
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
    ctx[Layers.Main].clearRect(0, 0, canvas[Layers.Main].width, canvas[Layers.Main].height);
    ctx[Layers.Main].fillRect(current, 20, 100, 100);
    return current < 500;
  });

  Graphics.init(canvas, ctx);
  Control.init(canvas[Layers.Main]);

};
