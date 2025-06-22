import { None, Option, Some } from "./option";
import { given, then, when } from "./test-util";

function getIndex(index: number): Option<number> {
  const arr = [0];

  if (index < 0 || index >= arr.length) {
    return new None();
  }

  return new Some(arr[index]);
}

function assertOption<T>(expected: Option<T>, actual: Option<T>) {
  expect(actual.valueOf()).toBe(expected.valueOf());
}

given("an Option enum", () => {
  let someValue: Option<number>;
  let noneValue: Option<number>;

  beforeEach(() => {
    someValue = getIndex(0);
    noneValue = getIndex(-1);
  });

  when("calling clone", () => {
    then("should not be same reference", () => {
      const anotherValue = someValue.clone();
      expect(anotherValue === someValue).toBe(false);
    });
  });

  when("calling and(optB)", () => {
    then("on Some value returns optB", () => {
      assertOption(new Some(10), someValue.and(new Some(10)));
    });
    then("on None value returns None", () => {
      assertOption(new None(), noneValue.and(new Some(10)));
    });
  });

  when("calling andThen(f)", () => {
    then("on Some value returns f(v)", () => {
      assertOption(
        new Some(10),
        someValue.andThen((val) => new Some(val + 10)),
      );
    });

    then("on None value returns None", () => {
      assertOption(
        new None(),
        noneValue.andThen((val) => new Some(val + 10)),
      );
    });
  });

  when("calling expect(msg)", () => {
    then("on Some(v) returns v", () => {
      expect(someValue.expect("hello")).toBe(0);
    });

    then("on None throws msg", () => {
      expect(() => noneValue.expect("hello")).toThrow(new Error("hello"));
    });
  });

  when("calling filter", () => {
    then("on Some(v) returns Some(v) when predicate is true", () => {
      assertOption(
        new Some(0),
        someValue.filter((v) => v === 0),
      );
    });

    then("on Some(v) returns None when predicate is false", () => {
      assertOption(
        new None(),
        someValue.filter((v) => v !== 0),
      );
    });

    then("on None returns None", () => {
      assertOption(
        new None(),
        noneValue.filter((v) => v !== 0),
      );
    });
  });

  when("calling isNone", () => {
    then("on Some returns false", () => {
      expect(someValue.isNone()).toBe(false);
    });

    then("on None returns true", () => {
      expect(noneValue.isNone()).toBe(true);
    });
  });
});
