import { LocationData } from './interfaces';

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
  times, url, options = {}
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
 * Geolocation lekérés
 * @return {Promise}
 */
export const getLocation = function (): Promise<LocationData> {
  return new Promise((
    resolve: (value: LocationData) => void, reject: (error: LocationData) => void
  ) => {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error: GeolocationPositionError) => {
        reject({
          error,
          latitude: 0,
          longitude: 0
        });
      }
    );
  });
};
