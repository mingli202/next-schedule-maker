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
    const arr: TCurrent[] = [];

    this.arr.forEach((el, i) => {
      const res = this.op(new Some(el), i);

      if (res.isSome()) {
        arr.push(res.unwrap());
      }
    });

    return arr;
  }

  public map<U>(fn: (val: TCurrent, index: number) => U): Iter<TInitial, U> {
    const op = (val: IOption<TInitial>, index: number) =>
      this.op(val, index).map((v) => fn(v, index));
    return new Iter(this.arr, op);
  }
}
