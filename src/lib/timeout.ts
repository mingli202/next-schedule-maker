/**
 * Returns a promise that timesout after the given @param timeoutMs
 * Rejects the promise if timeout
 * */
export async function newPromiseWithTimeout<T>(
  fn: (
    timedOut: { isTimedOut: boolean },
    resolve: (value: T) => void,
    // biome-ignore lint/suspicious/noExplicitAny: it's literaly the type bro
    reject: (reason?: any) => void,
  ) => void,
  timeoutMs: number,
) {
  return new Promise<T>((resolve, reject) => {
    const timedOut = {
      isTimedOut: false,
    };

    const t = setTimeout(() => {
      timedOut.isTimedOut = true;
      reject(`promise timed out after ${timeoutMs}ms`);
    }, timeoutMs);

    const resolveAndCancel = (value: T) => {
      clearTimeout(t);
      resolve(value);
    };

    fn(timedOut, resolveAndCancel, reject);
  });
}
