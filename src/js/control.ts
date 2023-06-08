export enum MoveDirection {
  LeftTop,
  LeftBottom,
  Down,
  RightBottom,
  RightTop,
  None
}

export enum StepDirection {
  Left,
  Right,
  Up,
  None
}

/**
 * Felhasználói irányítás (billentyűzet, egér kezelése)
 * @param controls <object> billentyűk adatai
 */
export const Control = {

  moveDirection: MoveDirection.None as MoveDirection,
  stepDirection: StepDirection.None as StepDirection,

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
        this.moveDirection = currentArea as MoveDirection;
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        this.stepDirection = StepDirection.Left;
      }
      if (event.key === 'ArrowRight') {
        this.stepDirection = StepDirection.Right;
      }
      if (event.key === 'ArrowUp') {
        this.stepDirection = StepDirection.Up;
      }
    });
    document.addEventListener('keyup', (_event) => {
      this.stepDirection = StepDirection.None;
    });
    document.addEventListener('click', (_event) => {
      // JUMP
    });
  }

};
