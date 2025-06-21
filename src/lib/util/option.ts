abstract class OptionBase<T> {
  #val?: T;

  constructor(val?: T) {
    this.#val = val;
  }

  filter(predicate: (val: T) => boolean): Option<T> {
    if (this.#val && predicate(this.#val)) {
      return new Some(this.#val);
    }

    return new None();
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
