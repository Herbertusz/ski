export enum Direction {
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
  BOTTOM = 'bottom'
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
   * @param a <float|object> ha object, akkor az x és y tagváltozók lesznek összeadva
   * @param b <float>
   * @return <float>
   */
  addition : function(a: number | Coord, b?: number): number | null {
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
   * Két egyenes metszete (vízszintes vagy függőleges)
   * c1 az egyik végpont c2 a másik koordinátája (x vagy y)
   * @param line1 <object> (c1,c2)
   * @param line2 <object> (c1,c2)
   * @return <object> (c1,c2)
   */
  getLineIntersection : function(line1: Line, line2: Line): Line | null {
    const intersect: Line = { c1 : 0, c2 : 0 };
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
        return null;
      }
    }
    else{
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
        return null;
      }
    }
    return intersect;
  },

  /**
   * Két téglalap érintkezési vonala
   * @param rect1 <object> (x1,y1,x2,y2)
   * @param rect2 <object> (x1,y1,x2,y2)
   * @param pixel <int> élek megengedett távolsága
   * @return <object|null> (c1,c2,dir)
   */
  getRectTouching : function(rect1: Rect, rect2: Rect, pixel: number): Line | null {
    if (typeof(pixel) == 'undefined') pixel = 0;
    let touching: LinearTouch | null = null;
    if (Math.abs(rect1.x1 - rect2.x2) <= pixel) {
      // rect1 bal oldala (külső)
      touching = this.getLineIntersection({c1 : rect1.y1, c2 : rect1.y2}, {c1 : rect2.y1, c2 : rect2.y2});
      if (touching) touching.dir = Direction.LEFT;
    }
    else if (Math.abs(rect1.x2 - rect2.x1) <= pixel) {
      // rect1 jobb oldala (külső)
      touching = this.getLineIntersection({c1 : rect1.y1, c2 : rect1.y2}, {c1 : rect2.y1, c2 : rect2.y2});
      if (touching) touching.dir =  Direction.RIGHT;
    }
    else if (Math.abs(rect1.y1 - rect2.y2) <= pixel) {
      // rect1 felső oldala (külső)
      touching = this.getLineIntersection({c1 : rect1.x1, c2 : rect1.x2}, {c1 : rect2.x1, c2 : rect2.x2});
      if (touching) touching.dir =  Direction.TOP;
    }
    else if (Math.abs(rect1.y2 - rect2.y1) <= pixel) {
      // rect1 felső oldala (külső)
      touching = this.getLineIntersection({c1 : rect1.x1, c2 : rect1.x2}, {c1 : rect2.x1, c2 : rect2.x2});
      if (touching) touching.dir =  Direction.BOTTOM;
    }
    return touching;
  },

  /**
   * Két téglalap metszete üres-e
   * @param rect1 <object> (x1,y1,x2,y2)
   * @param rect2 <object> (x1,y1,x2,y2)
   * @return <bool> true, ha van metszetük
   */
  isRectIntersection : function(rect1: Rect, rect2: Rect): boolean {
    if (rect1.x1 <= rect2.x2 && rect1.x2 >= rect2.x1 && rect1.y1 <= rect2.y2 && rect1.y2 >= rect2.y1) {
      return true;
    }
    else{
      return false;
    }
  },

  /**
   * Két téglalap metszete
   * @param rect1 <object> (x1,y1,x2,y2)
   * @param rect2 <object> (x1,y1,x2,y2)
   * @return <object|null> (x1,y1,x2,y2)
   */
  getRectIntersection : function(rect1: Rect, rect2: Rect): Rect | null{
    const intersect: Rect = { x1 : 0, y1 : 0, x2 : 0, y2 : 0 };
    let lineint;
    if ((lineint = this.getLineIntersection({c1 : rect1.x1, c2 : rect1.x2}, {c1 : rect2.x1, c2 : rect2.x2}))) {
      intersect.x1 = lineint.c1;
      intersect.x2 = lineint.c2;
    }
    else {
      return null;
    }
    if ((lineint = this.getLineIntersection({c1 : rect1.y1, c2 : rect1.y2}, {c1 : rect2.y1, c2 : rect2.y2}))) {
      intersect.y1 = lineint.c1;
      intersect.y2 = lineint.c2;
    }
    else {
      return null;
    }
    return intersect;
  }

};
