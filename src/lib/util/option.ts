import { Err, Ok, Result } from "./result";

abstract class OptionBase<T> extends Object {
  #val?: T;

  constructor(val?: T) {
    super();
    this.#val = val;
  }

  valueOf(): string {
    return this.toString();
  }

  toString(): string {
    if (this.#val === undefined) {
      return "None";
    } else {
      return `Some(${this.#val})`;
    }
  }

  public clone(): Option<T> {
    if (this.#val === undefined) {
      return new None();
    }
    return new Some(structuredClone(this.#val));
  }

  /**
   * @returns `None` if the option is `None`, otherwise returns `optB`
   * */
  public and<U>(optB: Option<U>): Option<U> {
    if (this.#val === undefined) {
      return new None();
    }
    return optB;
  }

  /**
   * @returns `None` if the option is `None`, otherwise call `f` with the wrapped value and returns the result
   * */
  public andThen<U>(f: (val: T) => Option<U>): Option<U> {
    if (this.#val === undefined) {
      return new None();
    }
    return f(this.#val);
  }

  /**
   * @returns the contained `Some` value
   * @throws if the value if a `None` with a custom error message provided by `msg`
   * */
  public expect(msg: string): T {
    if (this.#val === undefined) {
      throw new Error(msg);
    }
    return this.#val;
  }

  /**
   * @returns `None` if the option is `None`, otherwise calls `predicate` with the wrapped value and returns:
   * - `Some(t)` if `predicate` returns `true` (where `t` is the wrapped value), and
   * - `None` if `predicate` returns `false`
   * */
  public filter(predicate: (val: T) => boolean): Option<T> {
    if (this.#val !== undefined && predicate(this.#val)) {
      return new Some(this.#val);
    }

    return new None();
  }

  /**
   * @returns `true` if the option is a `None` value
   * */
  public isNone(): boolean {
    return this.#val === undefined;
  }

  /**
   * @returns `true` if the option is a `None` value or the value inside of it matches a predicate
   * */
  public isNoneOr(f: (val: T) => boolean): boolean {
    return this.#val === undefined || f(this.#val);
  }

  /**
   * @returns `true` if the option is a `Some` value
   * */
  public isSome(): boolean {
    return this.#val !== undefined;
  }

  /**
   * @returns `true` if the option is a `Some` and the value inside of it matches a predicate
   * */
  public isSomeAnd(f: (val: T) => boolean): boolean {
    return this.#val !== undefined && f(this.#val);
  }

  /**
   * Maps an `Option<T>` to `Option<U>` by applying a function to a contained value (if `Some`) or returns `None` (if `None`).
   * */
  public map<U>(f: (val: T) => U): Option<U> {
    return this.#val !== undefined ? new Some(f(this.#val)) : new None();
  }

  /**
   * @returns the provided fallback result (if none), or applies a function to the contained value (if any)
   * */
  public mapOr<U>(fallback: U, f: (val: T) => U): U {
    return this.#val === undefined ? fallback : f(this.#val);
  }

  /**
   * Computes a fallback function result (if none), or applies a different function to the contained value (if any)
   * */
  public mapOrElse<U>(fallback: () => U, f: (val: T) => U): U {
    return this.#val === undefined ? fallback() : f(this.#val);
  }

  /**
   * Transforms the `Option<T>` into a `Result<T, E>` mapping `Some(v)` to `Ok(v)` and `None` to `Err(err)`
   * */
  public okOr<E>(err: E): Result<T, E> {
    return this.#val === undefined ? new Err(err) : new Ok(this.#val);
  }

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None` to `Err(err())`
   * */
  public okOrElse<E>(err: () => E): Result<T, E> {
    return this.#val === undefined ? new Err(err()) : new Ok(this.#val);
  }

  /**
   * @returns the option if it contains a value, otherwise returns optB
   * */
  public or(optB: Option<T>): Option<T> {
    return this.#val === undefined ? optB : this;
  }

  /**
   * @returns the option if it contains a value, otherwise calls `f` and returns the result
   * */
  public orElse(f: () => Option<T>): Option<T> {
    return this.#val === undefined ? f() : this;
  }

  /**
   * Replaces the actual value in the option by the value given in parameter, returning the old value if present, leaving a `Some` in its place without deinitializing either one.
   * */
  public replace(value: T): Option<T> {
    const returnOpt =
      this.#val === undefined ? new None<T>() : new Some<T>(this.#val);

    this.#val = value;

    return returnOpt;
  }

  /**
   * Takes the value out of the option, leaving a `None` in its place.
   * */
  public take(): Option<T> {
    const toReturn =
      this.#val === undefined ? new None<T>() : new Some<T>(this.#val);

    this.#val = undefined;

    return toReturn;
  }

  /**
   * Takes the value out of the option, but only if the predicate evaluates to `true`.
   * In other words, replaces `this` with `None` if the predicate returns `true`.
   * */
  public takeIf(predicate: (val: T) => boolean): Option<T> {
    const toReturn =
      this.#val !== undefined && predicate(this.#val)
        ? new Some<T>(this.#val)
        : new None<T>();

    this.#val = undefined;

    return toReturn;
  }

  /**
   * @returns the contained `Some` value.
   * @throws if value is `None`.
   * */
  public unwrap(): T {
    if (this.#val === undefined) {
      throw new Error("Unwrapped a None value");
    }
    return this.#val;
  }

  /**
   * @returns the contained `Some` value or a provided fallback.
   * */
  public unwrapOr(fallback: T): T {
    if (this.#val === undefined) {
      return fallback;
    }

    return this.#val;
  }

  /**
   * @returns the contained `Some` value or computes it from a fallback function.
   * */
  public unwrapOrElse(f: () => T) {
    if (this.#val === undefined) {
      return f();
    }
    return this.#val;
  }

  /**
   * Zips `this` with another `Option`.
   * If `this` is `Some(s)` and other is `Some(o)`, this method returns `Some([s, o])`. Otherwise, `None` is returned.
   * */
  public zip<U>(other: Option<U>): Option<[T, U]> {
    if (this.#val === undefined || other.isNone()) {
      return new None();
    }

    return new Some([this.#val, other.unwrap()]);
  }

  /**
   * @returns `Some` if exactly one of `this`, `optB` is `Some`, otherwise returns `None`.
   * */
  public xor(optB: Option<T>): Option<T> {
    if (this.isSome() && optB.isNone()) {
      return this;
    } else if (this.isNone() && optB.isSome()) {
      return optB;
    } else {
      return new None();
    }
  }
}

export class Some<T> extends OptionBase<T> {
  constructor(val: T) {
    super(val);
  }
}

export class None<T> extends OptionBase<T> {
  constructor() {
    super();
  }
}

export type Option<T> = Some<T> | None<T>;
