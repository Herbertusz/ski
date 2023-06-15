import { Coord, Rect } from './geometry';

export enum Layers {
  Under = 'under',
  Main = 'main',
  Over = 'over'
}

export enum ImageId {
  character = 'character',
  characterJump = 'character',
  tree = 'tree',
  column = 'column',
  stone = 'stone'
}

export interface CanvasLayers {
  [Layers.Under]: HTMLCanvasElement;
  [Layers.Main]: HTMLCanvasElement;
  [Layers.Over]: HTMLCanvasElement;
}

export interface CanvasContexts {
  [Layers.Under]: CanvasRenderingContext2D;
  [Layers.Main]: CanvasRenderingContext2D;
  [Layers.Over]: CanvasRenderingContext2D;
}

/**
 * Grafikai motor
 */
export const Graphics = {

  canvas: { } as CanvasLayers,  // canvas elem
  ctx: { } as CanvasContexts,   // rajzoló kontextus
  currentImage: null,           // aktuális kép
  images: {
    // under
    character: { layer: Layers.Under, file: document.createElement('img') },
    // main
    tree: { layer: Layers.Main, file: document.createElement('img') },
    column: { layer: Layers.Main, file: document.createElement('img') },
    stone: { layer: Layers.Main, file: document.createElement('img') },
    // over
    characterJump: { layer: Layers.Over, file: document.createElement('img') }
  },

  init: function(canvas: CanvasLayers, ctx: CanvasContexts) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.drawObjects(ctx[Layers.Main]);
    // for (var i = 0; i < imagepaths.length; i++) {
    //   this.images[i] = new Image();
    //   this.images[i].src = imagepaths[i];
    // }
    // this.currentImage = this.images[0];
    // this.imagesize = imagesize;
    // this.startpos = startpos;
  },

  /**
   * Kép kirajzolása
   */
  drawImage: function(ctx: CanvasRenderingContext2D, image: CanvasImageSource, dimensions: Rect) {
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
  moveImage: function(imageID: ImageId, position: Coord): boolean {
    const layer = this.images[imageID].layer;
    this.deleteImage(this.ctx[layer], { x: 0, y: 0, w: 500, h: 300 });
    this.drawImage(this.ctx[layer], this.images[imageID].file, { ...position, w: 50, h: 50 });
    // this.deleteImage({ x: Current.pos.x, y: Current.pos.y });
    // this.ctx.save();
    // this.ctx.translate(Math.round(pos.x), Math.round(pos.y));
    // this.ctx.rotate(angle);
    // this.ctx.drawImage(this.currentImage, -Math.round(this.imagesize.w / 2), -Math.round(this.imagesize.h / 2));
    // this.ctx.restore();
    // Current.pos = pos;
    // Current.angle = angle;
    return true;
  },

  /**
   * Objektumok kirajzolása
   */
  drawObjects: function(ctx: CanvasRenderingContext2D): void {
    // const objects = Mediator.run('getTrackObjects', []);
    ctx.strokeStyle = 'red';
    ctx.strokeRect(300, 200, 50, 20);
  }

};
