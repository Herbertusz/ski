/**
 * Switch szerkezet funkcionális megfelelője (elsősorban értékadáshoz)
 * @param {*} variable - változó
 * @param {object} relations - változó különböző értékeihez rendelt visszatérési értékek
 * @param {*} [defaultValue=null] - alapértelmezett érték (default)
 * @return {*}
 * @example
 *  control = switching(key, {
 *    'W': 'accelerate',
 *    'A': 'turnLeft',
 *    'S': 'brake',
 *    'D': 'turnRight'
 *  }, null);
 * Ezzel egyenértékű:
 *  switch(key) {
 *    case 'W': control = 'accelerate'; break;
 *    case 'A': control = 'turnLeft'; break;
 *    case 'S': control = 'brake'; break;
 *    case 'D': control = 'turnRight'; break;
 *    default: control = null;
 *  }
 */
export const switching = function<T>(
  variable: number | string, relations: Record<string, T>, defaultValue: T
): T {
  let index: string;
  for (index in relations) {
    if (String(variable) === index) {
      return relations[index];
    }
  }
  return defaultValue;
};

/**
 * Elágazás funkcionális megfelelője (elsősorban értékadáshoz)
 * @param {array} construct - feltételes szerkezetet leíró tömb
 * @example
 *  variable = condition([
 *    [alert_date < alert_date, 1],
 *    [alert_date > alert_date, -1],
 *    [uniqueId > uniqueId, 1],
 *    [uniqueId < uniqueId, -1],
 *    [true, 0]
 *  ]);
 * Ezzel egyenértékű:
 *  if (alert_date < alert_date) {
 *    variable = 1;
 *  }
 *  else if (alert_date > alert_date) {
 *    variable = -1;
 *  }
 *  else if (uniqueId > uniqueId) {
 *    variable = 1;
 *  }
 *  else {
 *    variable = -1;
 *  }
 * @example
 *  condition([
 *    [input.type === 'checkbox', () => {
 *      statement A;
 *    }],
 *    [input.type === 'select', () => {
 *      statement B;
 *    }],
 *    [true, () => {
 *      statement C;
 *    }]
 *  ])();
 * Ezzel egyenértékű:
 *  if (input.type === 'checkbox') {
 *    statement A;
 *  }
 *  else if (input.type === 'select') {
 *    statement B;
 *  }
 *  else {
 *    statement C;
 *  }
 */
export const condition = function<T>(construct: [boolean, T][]): T {
  return (construct.find(branch => branch[0]) as [boolean, T])[1];
};

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
