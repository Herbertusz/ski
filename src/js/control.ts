import { condition } from './utility';
import { Operation } from './physics';

enum MoveType {
  Slide,
  Move,
  Stand
}

export enum MoveDirection {
  Left,
  LeftTop,
  LeftBottom,
  Down,
  RightBottom,
  RightTop,
  Right,
  Up,
  None
}

/**
 * Felhasználói irányítás (billentyűzet, egér kezelése)
 * @param controls <object> billentyűk adatai
 */
export const Control = {

  movement: {
    type: MoveType.Stand as MoveType,
    direction: MoveDirection.None as MoveDirection
  },

  init: function(canvas: HTMLCanvasElement) {
    document.addEventListener('mousemove', (event) => {
      const center = {
        x: canvas.width / 2,
        y: canvas.height / 2
      };
      const mouse = {
        x: event.clientX,
        y: event.clientY
      };
      if (mouse.y > center.y) {
        const angle = Math.atan((mouse.x - center.x) / (mouse.y - center.y));
        const diff = Math.PI / 5;
        const areas = [
          -(Math.PI / 2), -(Math.PI / 2) + diff, -(Math.PI / 2) + diff * 2, Math.PI / 2 - diff * 2, Math.PI / 2 - diff, Math.PI / 2
        ];
        const currentArea = areas.findIndex(
          (edge, i) => edge <= angle && areas[i + 1] > angle
        );
        this.movement = {
          type: MoveType.Slide,
          direction: currentArea
        };
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        this.movement = {
          type: MoveType.Move,
          direction: MoveDirection.Left
        };
      }
      if (event.key === 'ArrowRight') {
        this.movement = {
          type: MoveType.Move,
          direction: MoveDirection.Right
        };
      }
      if (event.key === 'ArrowUp') {
        this.movement = {
          type: MoveType.Move,
          direction: MoveDirection.Up
        };
      }
    });
    document.addEventListener('keyup', (_event) => {
      this.movement = {
        type: MoveType.Stand,
        direction: MoveDirection.None
      };
    });
    document.addEventListener('click', (_event) => {
      // TODO: jump
    });
  },

  getOperation: function(type: MoveType, direction: MoveDirection): Operation {
    return condition([
      [type === MoveType.Slide && direction === MoveDirection.Left, Operation.SlideLeft],
      [type === MoveType.Slide && direction === MoveDirection.LeftTop, Operation.SlideLeftTop],
      [type === MoveType.Slide && direction === MoveDirection.LeftBottom, Operation.SlideLeftBottom],
      [type === MoveType.Slide && direction === MoveDirection.Down, Operation.SlideDown],
      [type === MoveType.Slide && direction === MoveDirection.RightBottom, Operation.SlideRightBottom],
      [type === MoveType.Slide && direction === MoveDirection.RightTop, Operation.SlideRightTop],
      [type === MoveType.Slide && direction === MoveDirection.Right, Operation.SlideRight],
      [type === MoveType.Move  && direction === MoveDirection.Left, Operation.MoveLeft],
      [type === MoveType.Move  && direction === MoveDirection.Right, Operation.MoveRight],
      [type === MoveType.Move  && direction === MoveDirection.Up, Operation.MoveUp],
      [true, Operation.Stand]
    ]);
  }

};
