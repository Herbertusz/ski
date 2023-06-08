/**
 * Promisify-olt setTimeout
 * @param {number} timeout - késleltetés
 * @param {*} resolvedValue - továbbított érték
 * @return {Promise}
 */
export const delay = function (timeout: number, resolvedValue: unknown = null): Promise<unknown> {
  return new Promise((resolve: (value: unknown) => void) => {
    window.setTimeout(() => {
      resolve(resolvedValue);
    }, timeout);
  });
};

/**
 * Promise-ok szekvnciális végrehajtása
 * @param promiseFactories - promise-t visszaadó függvények tömbje
 * @return {Promise}
 * @example
 *  sequence([
 *    () => delay(1000, 1).then(() => 1),
 *    (value) => delay(2000, value).then((val) => val + 1),
 *    (value) => delay(1000, value).then((val) => val + 1)
 *  ])
 *  .then(
 *    (value) => console.log(value)
 *  )
 *  .catch(
 *    (error) => console.warn(error)
 *  );
 */
export const promiseSequence = function (promiseFactories: ((value: any) => any)[]): Promise<any> {
  return promiseFactories.reduce(
    (acc: Promise<any>, curr: (value: any) => Promise<any>) => acc.then(
      (value: any) => curr(value)
    ),
    Promise.resolve()
  );
};

/**
 * Fetch újrapróbalása amíg nem 2xx a response status code, legfeljebb times alkalommal
 * @param {Object} param
 * @return {Promise}
 */
export const tryRequest = function ({
  times, url, options = { }
}: {
  times: number, url: string, options?: RequestInit
}): Promise<any> {
  const repeat = (response: Response): Promise<any> | Response => {
    if (response.ok) {
      return response;
    }
    else {
      return fetch(url, options);
    }
  };

  return promiseSequence([
    () => fetch(url, options),
    ...new Array(times - 1).fill(repeat)
  ])
    .then(
      (response: Response) => {
        if (response.ok) {
          return response;
        }
        else {
          throw response;
        }
      }
    );
};

/**
 * Animáció futtatása
 * @param {number} speed - animáció sebessége (px/sec)
 * @param {function} operation - animáció minden lépésében lefutó függvény, ha false a visszatérési értéke, az animáció leáll
 * @example
 *  animate(200, (current) => {
 *    ctx.clearRect(0, 0, canvasTrack.width, canvasTrack.height);
 *    ctx.fillRect(current, 20, 100, 100);
 *    return current < 500;
 *  });
 */
export const animate = function(speed: number, operation: (count: number) => boolean) {
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
