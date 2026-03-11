import { type IOption, Some } from "./option";

type IterOp<T, U> = (val: IOption<T>, index: number) => IOption<U>;

/**
 * Custom implementation of a lazy iterator
 * Every oporator will be executed once per elements,
 * and there will only be a single pass through when consuming the iterator,
 * making it more efficient than working with arrays
 * */
export class Iter<TInitial, TCurrent> {
  private constructor(
    private arr: TInitial[],
    private op: IterOp<TInitial, TCurrent>,
  ) {}

  /**
   * Creates a new Iter from a given list of array
   * */
  public static from<T>(arr: T[]): Iter<T, T> {
    return new Iter(arr, (val) => val);
  }

  /**
   * Tests if every element of the iterator matches a predicate.
   *
   * all() takes a closure that returns true or false. It applies this closure to each element of the iterator, and if they all return true, then so does all(). If any of them return false, it returns false.
   *
   * all() is short-circuiting; in other words, it will stop processing as soon as it finds a false, given that no matter what else happens, the result will also be false.
   *
   * an empty iterator returns true
   * */
  public all(predicate: (val: TCurrent, index: number) => boolean): boolean {
    let acc = true;

    for (let i = 0; i < this.arr.length; i++) {
      const res = this.op(new Some(this.arr[i]), i);
      if (res.isSome()) {
        acc &&= predicate(res.unwrap(), i);
      }

      if (!res) {
        return false;
      }
    }

    return acc;
  }

  /**
   * Tests if any element of the iterator matches a predicate.
   *
   * any() takes a closure that returns true or false. It applies this closure to each element of the iterator, and if any of them return true, then so does any(). If they all return false, it returns false.
   *
   * any() is short-circuiting; in other words, it will stop processing as soon as it finds a true, given that no matter what else happens, the result will also be true.
   *
   * An empty iterator returns false.
   * */
  public any(predicate: (val: TCurrent, index: number) => boolean): boolean {
    let acc = false;

    for (let i = 0; i < this.arr.length; i++) {
      const res = this.op(new Some(this.arr[i]), i);
      if (res.isSome()) {
        acc ||= predicate(res.unwrap(), i);
      }

      if (res) {
        return true;
      }
    }

    return acc;
  }

  /**
   * Collects
   * */
  public collect(): TCurrent[] {
    const initialValue: TCurrent[] = [];
    return this.fold(initialValue, (acc, val) => [...acc, val]);
  }

  public filter(
    fn: (val: TCurrent, index: number) => boolean,
  ): Iter<TInitial, TCurrent> {
    const op = (val: IOption<TInitial>, index: number) =>
      this.op(val, index).filter((val) => fn(val, index));

    return new Iter(this.arr, op);
  }

  public fold<U>(
    initialValue: U,
    f: (acc: U, val: TCurrent, index: number) => U,
  ) {
    let acc = initialValue;

    this.arr.forEach((val, i) => {
      const res = this.op(new Some(val), i);

      if (res.isSome()) {
        acc = f(acc, res.unwrap(), i);
      }
    });

    return acc;
  }

  public map<U>(fn: (val: TCurrent, index: number) => U): Iter<TInitial, U> {
    const op = (val: IOption<TInitial>, index: number) =>
      this.op(val, index).map((v) => fn(v, index));

    return new Iter(this.arr, op);
  }

  public take(n: number): Iter<TInitial, TCurrent> {
    return this.filter((_, i) => i < n);
  }

  public skip(n: number): Iter<TInitial, TCurrent> {
    return this.filter((_, i) => i >= n);
  }
}
