import { Coord, Rect } from './geometry';

export enum Layers {
  Main = 'main'
}

export enum ImageId {
  character = 'character',
  characterJump = 'character',
  tree = 'tree',
  column = 'column',
  stone = 'stone'
}

export interface CanvasLayers {
  [Layers.Main]: HTMLCanvasElement;
}

export interface CanvasContexts {
  [Layers.Main]: CanvasRenderingContext2D;
}

/**
 * Grafikai motor
 */
export const Graphics = {

  canvas: { } as CanvasLayers,  // canvas elem
  ctx: { } as CanvasContexts,   // rajzoló kontextus
  currentImage: null,           // aktuális kép
  images: {
    tree: { file: document.createElement('img') },
    column: { file: document.createElement('img') },
    stone: { file: document.createElement('img') },
    character: { file: document.createElement('img') },
    characterJump: { file: document.createElement('img') }
  },
  drawingQueue: [] as HTMLImageElement[],

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
   * Kép betöltése
   * @param {string} fileName - ?
   * @return {Promise} ?
   */
  loadImage: function(fileName: string): Promise<HTMLImageElement> {
    const img = document.createElement('img');
    const promise: Promise<HTMLImageElement> = new Promise((resolve, reject) => {
      img.onload = (_event) => {
        resolve(img);
      };
      img.onerror = (event) => {
        reject(event);
      };
    });
    img.src = fileName;
    return promise;
  },

  /**
   * Kép kirajzolása
   */
  drawImage: function(ctx: CanvasRenderingContext2D, image: CanvasImageSource, dimensions: Rect) {
    ctx.drawImage(image, dimensions.x, dimensions.y, dimensions.w, dimensions.h);
  },

  /**
   * Terület törlése
   */
  deleteImage: function(ctx: CanvasRenderingContext2D, dimensions: Rect) {
    ctx.clearRect(dimensions.x, dimensions.y, dimensions.w, dimensions.h);
  },

  /**
   * Kép transzformálása (eltolás)
   */
  moveImage: function(imageID: ImageId, position: Coord): boolean {
    const layer = Layers.Main;
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
