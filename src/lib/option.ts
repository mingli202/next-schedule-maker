export interface Option<T> {
  /**
   * Returns None if the option is None, otherwise returns optb.
   * */
  and<U>(optb: Option<U>): Option<U>;

  /**
   * Returns None if the option is None, otherwise calls f with the wrapped value and returns the result.
   * */
  andThen<U>(f: (val: T) => Option<U>): Option<U>;

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
  filter(predicate: (val: T) => boolean): Option<T>;

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
  map<U>(f: (val: T) => U): Option<U>;

  /**
   * Returns the provided default result (if none), or applies a function to the contained value (if any).
   * */
  mapOr<U>(defaultValue: U, f: (val: T) => U): Option<U>;

  /**
   * Computes a default function result (if none), or applies a different function to the contained value (if any).
   * */
  mapOrElse<U>(defaultFunc: () => U, f: (val: T) => U): Option<U>;

  /**
   * Returns the option if it contains a value, otherwise returns optb.
   * */
  or(optb: Option<T>): Option<T>;

  /**
   * Returns the option if it contains a value, otherwise calls f and returns the result
   * */
  orElse(f: () => Option<T>): Option<T>;

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

export class Some<T> implements Option<T> {
  constructor(private value: T) {}

  and<U>(optb: Option<U>): Option<U> {
    return optb;
  }

  andThen<U>(f: (val: T) => Option<U>): Option<U> {
    return f(this.value);
  }

  expect(_msg: string): T {
    return this.value;
  }

  filter(predicate: (val: T) => boolean): Option<T> {
    return predicate(this.value) ? this : none<T>();
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

  map<U>(f: (val: T) => U): Option<U> {
    return some(f(this.value));
  }

  mapOr<U>(_defaultValue: U, f: (val: T) => U): Option<U> {
    return some(f(this.value));
  }

  mapOrElse<U>(_defaultFunc: () => U, f: (val: T) => U): Option<U> {
    return some(f(this.value));
  }

  or(_optb: Option<T>): Option<T> {
    return this;
  }

  orElse(_f: () => Option<T>): Option<T> {
    return this;
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

export class None<T> implements Option<T> {
  and<U>(_optb: Option<U>): Option<U> {
    return none<U>();
  }

  andThen<U>(_f: (val: T) => Option<U>): Option<U> {
    return none<U>();
  }

  expect(msg: string): T {
    throw new Error(msg);
  }

  filter(_predicate: (val: T) => boolean): Option<T> {
    return this;
  }

  isNone(): boolean {
    return true;
  }

  isNoneOr(_predicate: (val: T) => boolean): boolean {
    return true;
  }

  isSome(): boolean {
    return false;
  }

  isSomeAnd(_predicate: (val: T) => boolean): boolean {
    return false;
  }

  map<U>(_f: (val: T) => U): Option<U> {
    return none<U>();
  }

  mapOr<U>(defaultValue: U, _f: (val: T) => U): Option<U> {
    return some(defaultValue);
  }

  mapOrElse<U>(defaultFunc: () => U, _f: (val: T) => U): Option<U> {
    return some(defaultFunc());
  }

  or(optb: Option<T>): Option<T> {
    return optb;
  }

  orElse(f: () => Option<T>): Option<T> {
    return f();
  }

  unwrap(): T {
    throw new Error("Unwrapped a None value");
  }

  unwrapOr(defaultValue: T): T {
    return defaultValue;
  }

  unwrapOrElse(f: () => T): T {
    return f();
  }
}

export function some<T>(val: T): Option<T> {
  return new Some<T>(val);
}
export function none<T>(): Option<T> {
  return new None<T>();
}
