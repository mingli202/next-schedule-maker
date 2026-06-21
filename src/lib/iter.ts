import { none, type Option, some } from "./option";

/**
 * Custom implementation of a lazy iterator
 * Every operator will be executed once per elements,
 * and there will only be a single pass through when consuming the iterator,
 * making it more efficient than working with arrays
 * */
export class Iter<T> implements Iterable<T> {
  private constructor(
    private readonly iteratorFactory: () => IterableIterator<T>,
  ) {}

  public static from<T>(arr: Iterable<T>): Iter<T> {
    return new Iter(function* () {
      yield* arr;
    });
  }

  public [Symbol.iterator](): IterableIterator<T> {
    return this.iteratorFactory();
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
  public all(predicate: (val: T, index: number) => boolean): boolean {
    let index = 0;
    for (const val of this) {
      if (!predicate(val, index)) {
        return false;
      }
      index += 1;
    }

    return true;
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
  public any(predicate: (val: T, index: number) => boolean): boolean {
    let index = 0;
    for (const val of this) {
      if (predicate(val, index)) {
        return true;
      }
      index += 1;
    }

    return false;
  }

  /**
   * Takes two iterators and creates a new iterator over both in sequence.
   * */
  public chain(other: Iter<T>): Iter<T> {
    const source = this;
    return new Iter(function* () {
      yield* source;
      yield* other;
    });
  }

  /**
   * Counts the number of iterations
   * */
  public count(): number {
    return this.fold(0, (acc) => acc + 1);
  }

  /**
   * Collects the itererator by applying all the operations and returning the resulting array
   * */
  public collect(): T[] {
    const results: T[] = [];
    for (const val of this) {
      results.push(val);
    }

    return results;
  }

  /**
   * Keep values matching the given predicate
   * */
  public filter(predicate: (val: T, index: number) => boolean): Iter<T> {
    const source = this;
    return new Iter(function* () {
      let index = 0;
      for (const val of source) {
        if (predicate(val, index)) {
          yield val;
        }
        index += 1;
      }
    });
  }

  /**
   * Creates an iterator that both filters and maps.
   * The returned iterator yields only the values for which the supplied closure returns Some(value).
   * */
  public filterMap<U>(fn: (val: T, index: number) => Option<U>): Iter<U> {
    const source = this;

    return new Iter(function* () {
      let index = 0;
      for (const val of source) {
        const newVal = fn(val, index);

        if (newVal.isSome()) {
          yield newVal.unwrap();
        }

        index++;
      }
    });
  }

  /**
   * Searches for an element of an iterator that satisfies a predicate.
   *
   * find() takes a closure that returns true or false. It applies this closure to each element of the iterator, and if any of them return true, then find() returns Some(element). If they all return false, it returns None.
   * */
  public find(predicate: (val: T, index: number) => boolean): Option<T> {
    let index = 0;
    for (const val of this) {
      if (predicate(val, index)) {
        return some(val);
      }
      index++;
    }

    return none<T>();
  }

  /**
   * Applies function to the elements of iterator and returns the first non-none result.
   * */
  public findMap<U>(f: (val: T, index: number) => Option<U>): Option<U> {
    let index = 0;
    for (const val of this) {
      const res = f(val, index);

      if (res.isSome()) {
        return res;
      }

      index++;
    }

    return none<U>();
  }

  /**
   * Folds every element into an accumulator by applying an operation, returning the final result.
   * */
  public fold<U>(initialValue: U, f: (acc: U, val: T, index: number) => U): U {
    let acc = initialValue;
    let index = 0;
    for (const val of this) {
      acc = f(acc, val, index);
      index += 1;
    }

    return acc;
  }

  /**
   * Calls a closure on each element of an iterator.
   * This is equivalent to using a for loop on the iterator, although break and continue are not possible from a closure.
   * */
  public forEach(f: (val: T, index: number) => void): void {
    let index = 0;
    for (const val of this) {
      f(val, index);
      index++;
    }
  }

  /**
   * Map every element of this iterator to another
   * */
  public map<U>(f: (val: T, index: number) => U): Iter<U> {
    const source = this;
    return new Iter(function* () {
      let index = 0;
      for (const val of source) {
        yield f(val, index);
        index += 1;
      }
    });
  }

  /**
   * Maps then flattens
   * */
  public flatMap<U>(f: (val: T, index: number) => Iterable<U>): Iter<U> {
    const source = this;
    return new Iter(function* () {
      let index = 0;
      for (const val of source) {
        yield* f(val, index);
        index++;
      }
    });
  }

  /**
   * Flattens one level of nested iterables.
   * */
  public flatten<U>(this: Iter<Iterable<U>>): Iter<U> {
    const source = this;
    return new Iter(function* () {
      for (const val of source) {
        yield* val;
      }
    });
  }

  /**
   * Creates an iterator that both yields elements based on a predicate and maps.
   *
   * mapWhile() takes a closure as an argument. It will call this closure on each element of the iterator, and yield elements while it returns Some(_).
   * */
  public mapWhile<U>(f: (val: T, index: number) => Option<U>): Iter<U> {
    const source = this;

    return new Iter(function* () {
      let index = 0;

      for (const val of source) {
        const res = f(val, index);

        if (res.isSome()) {
          yield res.unwrap();
        } else {
          break;
        }

        index++;
      }
    });
  }

  /**
   * Take the first n elements
   * */
  public take(n: number): Iter<T> {
    const source = this;
    const limit = Math.max(0, Math.floor(n));
    return new Iter(function* () {
      if (limit === 0) {
        return;
      }
      let index = 0;
      for (const val of source) {
        yield val;
        index += 1;

        if (index >= limit) {
          break;
        }
      }
    });
  }

  /**
   * Creates an iterator that yields elements based on a predicate.
   *
   * takeWhile() takes a closure as an argument. It will call this closure on each element of the iterator, and yield elements while it returns true.
   *
   * After false is returned, take_while()’s job is over, and the rest of the elements are ignored.
   * */
  public takeWhile(predicate: (val: T, index: number) => boolean): Iter<T> {
    const source = this;
    return new Iter(function* () {
      let index = 0;
      for (const val of source) {
        if (!predicate(val, index)) {
          break;
        }
        yield val;
        index += 1;
      }
    });
  }

  /**
   * Skip the first n elements
   * */
  public skip(n: number): Iter<T> {
    const source = this;
    const toSkip = Math.max(0, Math.floor(n));
    return new Iter(function* () {
      if (toSkip === 0) {
        yield* source;
        return;
      }
      let skipped = 0;
      for (const val of source) {
        if (skipped < toSkip) {
          skipped += 1;
          continue;
        }
        yield val;
      }
    });
  }

  /**
   * Creates an iterator that skips elements based on a predicate.
   *
   * skipWhile() takes a closure as an argument. It will call this closure on each element of the iterator, and ignore elements until it returns false.
   *
   * After false is returned, skipWhile()’s job is over, and the rest of the elements are yielded.
   * */
  public skipWhile(predicate: (val: T, index: number) => boolean): Iter<T> {
    const source = this;
    return new Iter(function* () {
      let stopSkipping = false;
      let index = 0;

      for (const val of source) {
        if (!stopSkipping && !predicate(val, index)) {
          stopSkipping = true;
        }
        if (stopSkipping) {
          yield val;
        }
        index++;
      }
    });
  }

  /**
   * Zips two iterators together into pairs.
   *
   * The returned iterator yields pairs until either source iterator is exhausted.
   * */
  public zip<U>(other: Iter<U>): Iter<[T, U]> {
    const source = this;
    return new Iter(function* () {
      const otherIterator = other[Symbol.iterator]();

      for (const val of source) {
        const nextOther = otherIterator.next();
        if (nextOther.done) {
          break;
        }

        yield [val, nextOther.value];
      }
    });
  }
}
