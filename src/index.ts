/**
 * Animáció futtatása
 * @param {number} speed - animáció sebessége (px/sec)
 * @param {function} operation - animáció minden lépésében lefutó függvény, ha false a visszatérési értéke, az animáció leáll
 */
const animate = function(speed: number, operation: (count: number) => boolean) {
  let start: number | null = null;

  const step = (timeStamp: number) => {
    if (!start) {
      start = timeStamp;
    }
    const elapsed = timeStamp - start;

    const count = speed / 1000 * elapsed;
    const continueAnimation = operation(count);

    if (continueAnimation) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
};

window.onload = function() {

  const canvasTrack = document.getElementById('track') as HTMLCanvasElement;
  const canvasSkier = document.getElementById('skier') as HTMLCanvasElement;
  const ctxTrack = canvasTrack.getContext('2d') as CanvasRenderingContext2D;
  const _ctxSkier = canvasSkier.getContext('2d') as CanvasRenderingContext2D;

  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    canvasTrack.width = window.innerWidth;
    canvasTrack.height = window.innerHeight;
    canvasSkier.width = window.innerWidth;
    canvasSkier.height = window.innerHeight;
  }

  resizeCanvas();

  animate(200, (steps) => {
    ctxTrack.clearRect(0, 0, canvasTrack.width, canvasTrack.height);
    ctxTrack.fillRect(steps, 20, 100, 100);
    return steps < 500;
  });

};
