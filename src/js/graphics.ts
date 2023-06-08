import { Rect } from './geometry';

export enum Layers {
  Under = 'under',
  Main = 'main',
  Over = 'over'
}

export interface CanvasLayers {
  under: HTMLCanvasElement;
  main: HTMLCanvasElement;
  over: HTMLCanvasElement;
}

export interface CanvasContexts {
  under: CanvasRenderingContext2D;
  main: CanvasRenderingContext2D;
  over: CanvasRenderingContext2D;
}

/**
 * Grafikai műveletek kezelése
 */
export const Graphics = {

  canvas: { } as CanvasLayers,  // canvas elem
  ctx: { } as CanvasContexts,   // rajzoló kontextus
  currentimage: null,          // aktuális kép
  images: {
    [Layers.Under]: [],
    [Layers.Main]: [],
    [Layers.Over]: []
  },

  init: function(canvas: CanvasLayers, ctx: CanvasContexts) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.drawObjects(ctx[Layers.Main]);
    // for (var i = 0; i < imagepaths.length; i++) {
    //   this.images[i] = new Image();
    //   this.images[i].src = imagepaths[i];
    // }
    // this.currentimage = this.images[0];
    // this.imagesize = imagesize;
    // this.startpos = startpos;
  },

  /**
   * Kép kirajzolása
   */
  createImage: function(ctx: CanvasRenderingContext2D, image: CanvasImageSource, dimensions: Rect) {
    ctx.translate(dimensions.x, dimensions.y);
    ctx.save();
    ctx.drawImage(image, -Math.round(dimensions.w / 2), -Math.round(dimensions.h / 2));
    ctx.restore();
  },

  /**
   * Terület törlése
   */
  deleteImage: function(ctx: CanvasRenderingContext2D, dimensions: Rect) {
    const w = Math.round(Math.SQRT2 * dimensions.w);
    const h = Math.round(Math.SQRT2 * dimensions.h);
    ctx.clearRect(dimensions.x - Math.round(w / 2), dimensions.y - Math.round(h / 2), w, h);
  },

  /**
   * Kép transzformálása (eltolás + elforgatás)
   * @param pos <object> új pozíció
   * @param angle <float> új szögelfordulás
   */
  moveImage: function() {
    // if (pos === Current.pos && angle === Current.angle) {
    //   return false;
    // }
    // else {
    //   this.deleteImage({ x: Current.pos.x, y: Current.pos.y });
    //   this.ctx.save();
    //   this.ctx.translate(Math.round(pos.x), Math.round(pos.y));
    //   this.ctx.rotate(angle);
    //   this.ctx.drawImage(this.currentimage, -Math.round(this.imagesize.w / 2), -Math.round(this.imagesize.h / 2));
    //   this.ctx.restore();
    //   Current.pos = pos;
    //   Current.angle = angle;
    //   return true;
    // }
  },

  /**
   * Objektumok kirajzolása
   */
  drawObjects: function(ctx: CanvasRenderingContext2D) {
    // const objects = Mediator.run('getTrackObjects', []);
    ctx.strokeStyle = 'red';
    ctx.strokeRect(300, 200, 50, 20);
  }

};
