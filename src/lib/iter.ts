import { type IOption, Some } from "./option";

type IterOp<T, U> = (val: IOption<T>, index: number) => IOption<U>;

export class Iter<TInitial, TCurrent> {
  private constructor(
    private arr: TInitial[],
    private op: IterOp<TInitial, TCurrent>,
  ) {}

  public static from<T>(arr: T[]): Iter<T, T> {
    return new Iter(arr, (val) => val);
  }

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
