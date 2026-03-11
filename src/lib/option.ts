export interface IOption<T> {
  /**
   * Returns None if the option is None, otherwise returns optb.
   * */
  and<U>(optb: IOption<U>): IOption<U>;

  /**
   * Returns None if the option is None, otherwise calls f with the wrapped value and returns the result.
   * */
  andThen<U>(f: (val: T) => IOption<U>): IOption<U>;

  /**
   * Returns the contained Some value
   * @throws if the value is a None with a custom message provided my `msg`
   * */
  expect(msg: string): T;

  /**
   * Returns None if the option is None, otherwise calls predicate with the wrapped value and returns:
   * - Some(t) if predicate returns true (where t is the wrapped value), and
   * - None if predicate returns false.
   * */
  filter(predicate: (val: T) => boolean): IOption<T>;

  /**
   * Returns true if the option is a None value.
   * */
  isNone(): boolean;

  /**
   * Returns true if the option is a None or the value inside of it matches a predicate.
   * */
  isNoneOr(predicate: (val: T) => boolean): boolean;

  /**
   * Returns true if the option is a Some value.
   * */
  isSome(): boolean;

  /**
   * Returns true if the option is a Some and the value inside of it matches a predicate.
   * */
  isSomeAnd(predicate: (val: T) => boolean): boolean;

  /**
   * Maps an Option<T> to Option<U> by applying a function to a contained value (if Some) or returns None (if None).
   * */
  map<U>(f: (val: T) => U): IOption<U>;

  /**
   * Returns the provided default result (if none), or applies a function to the contained value (if any).
   * */
  mapOr<U>(defaultValue: U, f: (val: T) => U): IOption<U>;

  /**
   * Computes a default function result (if none), or applies a different function to the contained value (if any).
   * */
  mapOrElse<U>(defaultFunc: () => U, f: (val: T) => U): IOption<U>;

  /**
   * Returns the option if it contains a value, otherwise returns optb.
   * */
  or(optb: IOption<T>): IOption<T>;

  /**
   * Returns the option if it contains a value, otherwise calls f and returns the result
   * */
  orElse(f: () => IOption<T>): IOption<T>;

  /**
   * Replaces the actual value in the option by the value given in parameter, returning the old value if present, leaving a Some in its place without deinitializing either one.
   * */
  replace(value: T): IOption<T>;

  /**
   * Returns the contained Some value, consuming the self value.
   * */
  unwrap(): T;

  /**
   * Returns the contained Some value or a provided default.
   * */
  unwrapOr(defaultValue: T): T;

  /**
   * Returns the contained Some value or computes it from a closure.
   * */
  unwrapOrElse(f: () => T): T;
}

export class Some<T> implements IOption<T> {
  constructor(private value: T) {}

  and<U>(optb: IOption<U>): IOption<U> {
    return optb;
  }

  andThen<U>(f: (val: T) => IOption<U>): IOption<U> {
    return f(this.value);
  }

  expect(_msg: string) {
    return this.value;
  }

  filter(predicate: (val: T) => boolean): IOption<T> {
    return predicate(this.value) ? this : new None();
  }

  isNone(): boolean {
    return false;
  }

  isNoneOr(predicate: (val: T) => boolean): boolean {
    return predicate(this.value);
  }

  isSome(): boolean {
    return true;
  }

  isSomeAnd(predicate: (val: T) => boolean): boolean {
    return predicate(this.value);
  }

  map<U>(f: (val: T) => U): IOption<U> {
    return new Some(f(this.value));
  }

  mapOr<U>(_defaultValue: U, f: (val: T) => U): IOption<U> {
    return new Some(f(this.value));
  }

  mapOrElse<U>(_defaultFunc: () => U, f: (val: T) => U): IOption<U> {
    return new Some(f(this.value));
  }

  or(_optb: IOption<T>): IOption<T> {
    return this;
  }

  orElse(_f: () => IOption<T>): IOption<T> {
    return this;
  }

  replace(value: T): IOption<T> {
    const oldSome = new Some(this.value);
    this.value = value;
    return oldSome;
  }

  unwrap(): T {
    return this.value;
  }

  unwrapOr(_defaultValue: T): T {
    return this.value;
  }

  unwrapOrElse(_f: () => T): T {
    return this.value;
  }
}

export class None implements IOption<void> {
  expect(msg: string) {
    throw new Error(msg);
  }
}
