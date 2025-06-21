class Ref<T> {
  #val: T;

  constructor(val: T) {
    this.#val = val;
  }

  public set(newVal: T) {
    this.#val = newVal;
  }

  public get(): T {
    return this.#val;
  }
}

abstract class OptionBase<T> extends Object {
  #val?: Ref<T>;

  constructor(val?: T) {
    super();
    if (val) {
      this.#val = new Ref(val);
    }
  }

  valueOf(): string {
    return this.toString();
  }

  toString(): string {
    if (this.#val === undefined) {
      return "None";
    } else {
      return `Some(${this.#val.get()})`;
    }
  }

  /**
   * @returns the contained `Some` value
   * @throws if the value if a `None` with a custom error message provided by `msg`
   * */
  public expect(msg: string): T {
    if (this.#val) {
      return this.#val.get();
    }

    throw new Error(msg);
  }

  /**
   * @returns `None` if the option is `None`, otherwise calls `predicate` with the wrapped value and returns:
   * - `Some(t)` if `predicate` returns `true` (where `t` is the wrapped value), and
   * - `None` if `predicate` returns `false`
   * */
  public filter(predicate: (val: T) => boolean): Option<T> {
    if (this.#val && predicate(this.#val.get())) {
      return new Some(this.#val.get());
    }

    return new None();
  }

  public getOrInsert(value: T): Ref<T> {
    if (this.#val === undefined) {
      this.#val = new Ref(value);
    }
    return this.#val;
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

const x = new None<number>();
const y = x.getOrInsert(10);

console.log(x.valueOf());
console.log(y.get());

y.set(15);
console.log(x.valueOf());
console.log(y.get());
