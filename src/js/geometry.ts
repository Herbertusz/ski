export enum Direction {
  Left = 'left',
  Right = 'right',
  Top = 'top',
  Bottom = 'bottom'
}

export interface Coord {
  x: number;
  y: number;
}

export interface Line {
  c1: number;
  c2: number;
}

export interface LinearTouch {
  c1: number;
  c2: number;
  dir?: Direction;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface RectEdges {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * Geometriai műveleteket végző objektum
 */
export const Geometry = {

  /**
   * Derékszögű vektorok összege (négyzetösszegek gyöke)
   * @param {number | object} a - ha object, akkor az x és y property-k lesznek összeadva
   * @param {number} [b]
   * @return {number}
   */
  addition: function(a: number | Coord, b?: number): number | null {
    if (typeof a === 'object') {
      return Math.sqrt(a.x * a.x + a.y * a.y);
    }
    else if (typeof b === 'number') {
      return Math.sqrt(a * a + b * b);
    }
    else {
      return null;
    }
  },

  /**
   * Téglalap {x,y,w,h} átkonvertalása {x1,y1,x2,y2} alakúra
   * @param {object} rect - téglalap
   * @return {object}
   */
  rectToEdges: function(rect: Rect): RectEdges {
    return {
      x1: rect.x,
      y1: rect.y,
      x2: rect.x + rect.w,
      y2: rect.y + rect.h
    };
  },

  /**
   * Két egyenes metszete (vízszintes vagy függőleges)
   * c1 az egyik végpont c2 a másik koordinátája (x vagy y)
   * @param {object} line1 - {c1,c2}
   * @param {object} line2 - {c1,c2}
   * @return {object} {c1,c2}
   */
  getLineIntersection: function(line1: Line, line2: Line): Line {
    const intersect: Line = { c1: 0, c2: 0 };
    if (line1.c1 < line2.c1) {
      if (line1.c2 > line2.c1) {
        if (line1.c2 > line2.c2) {
          // 1c1---2c1===2c2---1c2
          intersect.c1 = line2.c1;
          intersect.c2 = line2.c2;
        }
        else {
          // 1c1---2c1===1c2---2c2
          intersect.c1 = line2.c1;
          intersect.c2 = line1.c2;
        }
      }
      else {
        // 1c1---1c2  2c1---2c2
        return intersect;
      }
    }
    else {
      if (line1.c1 < line2.c2) {
        if (line1.c2 < line2.c2) {
          // 2c1---1c1===1c2---2c2
          intersect.c1 = line1.c1;
          intersect.c2 = line1.c2;
        }
        else {
          // 2c1---1c1===2c2---1c2
          intersect.c1 = line1.c1;
          intersect.c2 = line2.c2;
        }
      }
      else {
        // 2c1---2c2  1c1---1c2
        return intersect;
      }
    }
    return intersect;
  },

  /**
   * Két téglalap érintkezési vonala
   * @param {object} rect1 - {x,y,w,h}
   * @param {object} rect2 - {x,y,w,h}
   * @param {number} [pixel=0] - élek megengedett távolsága
   * @return {object | null} {c1,c2,dir}
   */
  getRectTouching: function(rect1: Rect, rect2: Rect, pixel: number = 0): Line | null {
    let touching: LinearTouch | null = null;
    const r1 = this.rectToEdges(rect1);
    const r2 = this.rectToEdges(rect2);
    if (Math.abs(r1.x1 - r2.x2) <= pixel) {
      // rect1 bal oldala (külső)
      touching = this.getLineIntersection({ c1: r1.y1, c2: r1.y2 }, { c1: r2.y1, c2: r2.y2 });
      if (touching) touching.dir = Direction.Left;
    }
    else if (Math.abs(r1.x2 - r2.x1) <= pixel) {
      // rect1 jobb oldala (külső)
      touching = this.getLineIntersection({ c1: r1.y1, c2: r1.y2 }, { c1: r2.y1, c2: r2.y2 });
      if (touching) touching.dir =  Direction.Right;
    }
    else if (Math.abs(r1.y1 - r2.y2) <= pixel) {
      // rect1 felső oldala (külső)
      touching = this.getLineIntersection({ c1: r1.x1, c2: r1.x2 }, { c1: r2.x1, c2: r2.x2 });
      if (touching) touching.dir =  Direction.Top;
    }
    else if (Math.abs(r1.y2 - r2.y1) <= pixel) {
      // rect1 felső oldala (külső)
      touching = this.getLineIntersection({ c1: r1.x1, c2: r1.x2 }, { c1: r2.x1, c2: r2.x2 });
      if (touching) touching.dir =  Direction.Bottom;
    }
    return touching;
  },

  /**
   * Két téglalap metszete üres-e
   * @param {object} rect1 - {x,y,w,h}
   * @param {object} rect2 - {x,y,w,h}
   * @return {boolean} true, ha van metszetük
   */
  isRectIntersection: function(rect1: Rect, rect2: Rect): boolean {
    const r1 = this.rectToEdges(rect1);
    const r2 = this.rectToEdges(rect2);
    return (r1.x1 <= r2.x2 && r1.x2 >= r2.x1 && r1.y1 <= r2.y2 && r1.y2 >= r2.y1);
  },

  /**
   * Két téglalap metszete
   * @param {object} rect1 - {x1,y1,x2,y2}
   * @param {object} rect2 - {x1,y1,x2,y2}
   * @return {object} {x1,y1,x2,y2}
   */
  getRectIntersection: function(rect1: Rect, rect2: Rect): Rect {
    const intersect: Rect = { x: 0, y: 0, w: 0, h: 0 };
    let lineInt;
    if ((
      lineInt = this.getLineIntersection(
        { c1: rect1.x, c2: rect1.x + rect1.w },
        { c1: rect2.x, c2: rect2.x + rect2.w }
      )
    )) {
      intersect.x = lineInt.c1;
      intersect.w = lineInt.c2 - lineInt.c1;
    }

    if ((
      lineInt = this.getLineIntersection(
        { c1: rect1.y, c2: rect1.y + rect1.h },
        { c1: rect2.y, c2: rect2.y + rect2.h }
      )
    )) {
      intersect.y = lineInt.c1;
      intersect.h = lineInt.c2 - lineInt.c1;
    }

    return intersect;
  },

  /**
   * Két téglalap metszete túllépi-e a pixelben megadott értékhatárt
   * @param {object} rect1
   * @param {object} rect2
   * @param {number} [pixel=0] megengedett túllépés
   * @return ha true, túllépte az értékhatárt
   */
  isOutsideOfObject: function(rect1: Rect, rect2: Rect, pixel: number = 0): boolean {
    const intersect = Geometry.getRectIntersection(rect1, rect2);
    return intersect.w > pixel || intersect.h > pixel;
  }

};
