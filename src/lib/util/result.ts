abstract class ResultBase<T> {
  constructor(protected _val: T) {}

  public abstract unwrap(): T;
  public abstract unwrap_or(fallback: T): T;
  public abstract isOk(): boolean;
  public abstract isErr(): boolean;
  public abstract expect(msg: string): T;
}

export class Ok<T> extends ResultBase<T> {
  public unwrap(): T {
    return this._val;
  }
  public unwrap_or(): T {
    return this._val;
  }
  public isOk(): boolean {
    return true;
  }
  public isErr(): boolean {
    return false;
  }
  public expect(): T {
    return this._val;
  }
}

export class Err<E> extends ResultBase<E> {
  public unwrap(): E {
    throw new Error("Unwrapped an Err value");
  }
  public unwrap_or(fallback: E): E {
    return fallback;
  }
  public isOk(): boolean {
    return false;
  }
  public isErr(): boolean {
    return true;
  }
  public expect(msg: string): E {
    throw new Error(msg);
  }
}

export type Result<T, E> = Ok<T> | Err<E>;

function isThisFive(n: number): Result<boolean, string> {
  if (n !== 5) {
    return new Err("This number is not five what");
  }

  return new Ok(true);
}

const clearlyFive = isThisFive(5);
console.log(clearlyFive.unwrap());
console.log(clearlyFive.isOk());

const notFive = isThisFive(0);
console.log(notFive.unwrap_or(false));
