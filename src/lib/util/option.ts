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

  /**
   * @returns the contained `Some` value
   * @throws if the value if a `None` with a custom error message provided by `msg`
   * */
  public expect(msg: string): T {
    if (this.#val) {
      return this.#val;
    }

    throw new Error(msg);
  }

  /**
   * @returns `None` if the option is `None`, otherwise calls `predicate` with the wrapped value and returns:
   * - `Some(t)` if `predicate` returns `true` (where `t` is the wrapped value), and
   * - `None` if `predicate` returns `false`
   * */
  public filter(predicate: (val: T) => boolean): Option<T> {
    if (this.#val && predicate(this.#val)) {
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
   * @returns `true` if the option is a some and the value inside of it matches a predicate
   * */
  public isSomeAnd(f: (val: T) => boolean): boolean {
    return this.#val !== undefined && f(this.#val);
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
