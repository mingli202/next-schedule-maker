export class Iter<TInitial, TCurrent> {
  private constructor(
    private arr: TInitial[],
    private op: (val: TInitial, index: number) => TCurrent,
  ) {}

  public static from<T>(arr: T[]): Iter<T, T> {
    return new Iter(arr, (val) => val);
  }

  public collect(): TCurrent[] {
    return this.arr.map(this.op);
  }

  public map<U>(fn: (val: TCurrent, index: number) => U): Iter<TInitial, U> {
    const op = (val: TInitial, index: number) => fn(this.op(val, index), index);
    return new Iter(this.arr, op);
  }
}
