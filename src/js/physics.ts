import { Coord } from './geometry';
import { Mediator } from './mediator';
import { MoveDirection } from './control';
import { ImageId } from './graphics';
import { switching } from './utility';

export enum Operation {
  SlideLeft,
  SlideLeftTop,
  SlideLeftBottom,
  SlideDown,
  SlideRightBottom,
  SlideRightTop,
  SlideRight,
  MoveLeft,
  MoveRight,
  MoveUp,
  Stand
}

export interface Acceleration {
  x: number,
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

/**
 * Fizikai motor
 */
export const Physics = {

  maxSpeed: 500,      // maximális sebesség
  minSpeed: 10,       // minimális sebesség (ennél kisebb sebesség 0-nak számít)
  gravity: {          // gravitációs gyorsulás
    Left: 0,
    LeftTop: 0.6 * 15,
    LeftBottom: 0.8 * 15,
    Down: 15,
    RightBottom: 0.8 * 15,
    RightTop: 0.6 * 15,
    Right: 0,
    Up: 0
  } as unknown as Record<MoveDirection, number>,
  thrust: {           // tolóerők
    Left: 10,
    Right: 10,
    Up: 7
  } as unknown as Record<MoveDirection, number>,
  friction: {         // súrlódási tényező
    Left: 5,
    Right: 5
  } as unknown as Record<MoveDirection, number>,
  direction: {
    Left: -Math.PI / 2,
    LeftTop: Math.PI / 6 * 2,
    LeftBottom: Math.PI / 6,
    Down: 0,
    RightBottom: -(Math.PI / 6),
    RightTop: -(Math.PI / 6 * 2),
    Right: Math.PI / 2,
    Up: Math.PI,
    None: 0
  } as unknown as Record<MoveDirection, number>,

  currentSpeed: {     // jelenlegi sebesség komponensekre bontva
    x: 0,
    y: 0
  } as Velocity,
  currentPosition: {  // jelenlegi pozíció komponensekre bontva
    x: 0,
    y: 0
  } as Coord,

  /**
   * Gyorsulás meghatározása a vezérlés és kölcsönhatások alapján
   * @param {object} directions - gyorsulások iránya
   * @return {object} eredő gyorsulás x és y irányú komponense
   */
  getAcceleration: function(directions: { gravity: MoveDirection, thrust: MoveDirection, friction: MoveDirection }): Acceleration {
    const acc = Mediator.addCoords(
      Mediator.getCoord({ length: this.gravity[directions.gravity], angle: this.direction[directions.gravity] }),
      Mediator.getCoord({ length: this.thrust[directions.thrust], angle: this.direction[directions.thrust] }),
      Mediator.getCoord({ length: this.friction[directions.friction], angle: this.direction[directions.friction] }),
    );
    return acc;
  },

  /**
   * Sebesség meghatározása a gyorsulás alapján
   * @param {object} acceleration - gyorsulás nagysága és iránya
   * @return {object} sebesség x és y irányú komponense
   */
  getSpeed: function(acceleration: Acceleration): Velocity {
    const newSpeed = {
      x: this.currentSpeed.x + acceleration.x,
      y: this.currentSpeed.y + acceleration.y
    };
    const speedAmount = Mediator.getVector(newSpeed).length;
    if (speedAmount > this.maxSpeed) {
      newSpeed.x = (this.maxSpeed * newSpeed.x) / speedAmount;
      newSpeed.y = (this.maxSpeed * newSpeed.y) / speedAmount;
    }
    if (speedAmount < this.minSpeed) {
      newSpeed.x = 0;
      newSpeed.y = 0;
    }
    return newSpeed;
  },

  /**
   * Következő pozíció meghatározása a sebesség alapján
   * @param {object} speed - sebesség x és y irányú komponense
   * @return {object} következő pozíció x és y koordinátája
   */
  getPosition: function(speed: Velocity): Coord {
    const newPos = {
      x: this.currentPosition.x + speed.x,
      y: this.currentPosition.y + speed.y
    };
    return newPos;
  },

  getCurrentPosition: function(): Coord {
    return this.currentPosition;
  },

  /**
   * Karakter következő pozíciója
   * @param {number} operation - mozgás típusa
   */
  getMovement: function(operation: Operation): Coord {
    const slideDirection = switching(operation, {
      [Operation.SlideLeftTop]: MoveDirection.LeftTop,
      [Operation.SlideLeftBottom]: MoveDirection.LeftBottom,
      [Operation.SlideDown]: MoveDirection.Down,
      [Operation.SlideRightBottom]: MoveDirection.RightBottom,
      [Operation.SlideRightTop]: MoveDirection.RightTop,
    }, MoveDirection.None);
    const thrustDirection = switching(operation, {
      [Operation.SlideLeft]: MoveDirection.Left,
      [Operation.SlideRight]: MoveDirection.Right,
      [Operation.MoveLeft]: MoveDirection.Left,
      [Operation.MoveRight]: MoveDirection.Right,
      [Operation.MoveUp]: MoveDirection.Up,
    }, MoveDirection.None);
    const frictionDirection = switching(operation, {
      [Operation.SlideLeft]: MoveDirection.Right,
      [Operation.SlideRight]: MoveDirection.Left,
      [Operation.MoveLeft]: MoveDirection.Right,
      [Operation.MoveRight]: MoveDirection.Left,
    }, MoveDirection.None);
    const acc = this.getAcceleration({
      gravity: slideDirection,
      thrust: thrustDirection,
      friction: frictionDirection
    });
    this.currentSpeed = this.getSpeed(acc);
    this.currentPosition = this.getPosition(this.currentSpeed);
    return this.currentPosition;
  },

  applyMovement: function(position: Coord) {
    Mediator.moveImage(ImageId.character, position);
    // Util.timer.acc = Util.timeout(this, this.setMovementImage, 30, [keydown]);
  },

  /**
   * Ütközés objektummal
   * @param {object} position - pozíció
   * @return {array} melyik objektumokkal ütközik
   */
  getCollision: function(position: Coord) {
    // var coll = [];
    // if (Mediator.run('isOutsideOf', ['top', pos]) && Current.speed.y < 0) {
    //   coll.push('top');
    // }
    // if (Mediator.run('isOutsideOf', ['bottom', pos]) && Current.speed.y >= 0) {
    //   coll.push('bottom');
    // }
    // if (Mediator.run('isOutsideOf', ['left', pos]) && Current.speed.x < 0) {
    //   coll.push('left');
    // }
    // if (Mediator.run('isOutsideOf', ['right', pos]) && Current.speed.x >= 0) {
    //   coll.push('right');
    // }
    // return coll;
  }

};
