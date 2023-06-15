import { Coord, Geometry, Vector } from './geometry';
import { Graphics, ImageId } from './graphics';
import { Physics } from './physics';

/**
 * Objektumok összekapcsolása
 * mediator (illesztő) minta
 */
export const Mediator = {

  getCurrentPosition: function(): Coord {
    return Physics.getCurrentPosition();
  },
  moveImage: function(imageID: ImageId, pos: Coord): boolean {
    return Graphics.moveImage(imageID, pos);
  },
  getVector: function(coord: Coord): Vector {
    return Geometry.getVector(coord);
  },
  getCoord: function(vector: Vector): Coord {
    return Geometry.getCoord(vector);
  },
  addCoords: function(...coords: Coord[]): Coord {
    return Geometry.addCoords(...coords);
  },
  // getTrackObjects: function() {
  //   return this.Track.objects[Current.track];
  // }

};
