abstract class ResultBase<T, E> {
  constructor(
    private _ok: boolean,
    protected _val: T | E,
  ) {}

  valueOf(): string {
    return this.toString();
  }

  toString(): string {
    if (this._ok) {
      return `Ok(${this._val})`;
    } else {
      return `Err(${this._val})`;
    }
  }

  /**
   * @returns the contained `Ok` value
   * @throws an `Error` with `msg` if the contained value is an `Err`
   * */
  public expect(msg: string): T {
    if (this._ok) {
      return this._val as T;
    }
    throw new Error(msg);
  }

  /**
   * @returns `true` if the result is`Ok`
   * */
  public isOk(): boolean {
    return this._ok;
  }

  /**
   * @returns `true` if the result is `Err`
   * */
  public isErr(): boolean {
    return !this._ok;
  }

  /**
   * Maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value, leaving an `Err` value untouched.
   * */
  public map<U>(op: (val: T) => U): Result<U, E> {
    if (this._ok) {
      return new Ok(op(this._val as T));
    } else {
      return new Err(this._val as E);
    }
  }

  /**
   * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value, leaving an `Ok` value untouched.
   * This function can be used to pass through a successful result while handling an error.
   * */
  public mapErr<F>(op: (e: E) => F): Result<T, F> {
    if (this._ok) {
      return new Ok(this._val as T);
    } else {
      return new Err(op(this._val as E));
    }
  }

  /**
   * Returns the provided fallback (if `Err`), or applied a function to the contained value (if `Ok`).
   * */
  public mapOr<U>(fallback: U, f: (val: T) => U): U {
    if (this._ok) {
      return f(this._val as T);
    } else {
      return fallback;
    }
  }

  /**
   * Maps a `Result<T, E>` to `U` by applying fallback function `fallback` to a contained `Err` value, or function `f` to a contained `Ok` value.
   * This function can be used to unpack a successful result while handling an error.
   * */
  public mapOrElse<U>(fallback: (e: E) => U, f: (val: T) => U): U {
    if (this._ok) {
      return f(this._val as T);
    } else {
      return fallback(this._val as E);
    }
  }

  /**
   * Calls `op` if the result is `Err`, otherwise returns the `Ok` value of `Self`
   * */
  public orElse<F>(op: (e: E) => Result<T, F>): Result<T, F> {
    if (this._ok) {
      return new Ok(this._val as T);
    } else {
      return op(this._val as E);
    }
  }

  /**
   * @returns the contained `Ok` value.
   * @throws if the value is an `Err`.
   * */
  public unwrap(): T {
    if (this._ok) {
      return this._val as T;
    }

    throw new Error("Unwrapped an Err value");
  }

  /**
   * @returns the contained `Err` value.
   * @throws if the value is an `Ok`.
   * */
  public unwrapErr(): E {
    if (this._ok) {
      throw new Error("Unwrapped an Ok value");
    }

    return this._val as E;
  }

  /**
   * @returns the contained `Ok` value or a provided fallback.
   * */
  public unwrapOr(fallback: T): T {
    if (this._ok) {
      return this._val as T;
    }
    return fallback;
  }

  /**
   * @returns the contained `Ok` value or computes it from the function `op`.
   * */
  public unwrapOrElse(op: (e: E) => T): T {
    if (this._ok) {
      return this._val as T;
    } else {
      return op(this._val as E);
    }
  }
}

export class Ok<T, E> extends ResultBase<T, E> {
  constructor(val: T) {
    super(true, val);
  }
}

export class Err<T, E> extends ResultBase<T, E> {
  constructor(val: E) {
    super(false, val);
  }
}

export type Result<T, E> = Ok<T, E> | Err<T, E>;
