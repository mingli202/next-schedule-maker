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

  when("calling isNoneOr(f)", () => {
    then("on Some(v) returns true if f(v) true", () => {
      expect(someValue.isNoneOr((v) => v === 0)).toBe(true);
    });
    then("on Some(v) returns true if f(v) is false", () => {
      expect(someValue.isNoneOr((v) => v !== 0)).toBe(false);
    });
    then("on None returns true", () => {
      expect(noneValue.isNoneOr((v) => v === 0)).toBe(true);
    });
  });

  when("calling isSome", () => {
    then("on Some returns true", () => {
      expect(someValue.isSome()).toBe(true);
    });

    then("on None returns false", () => {
      expect(noneValue.isSome()).toBe(false);
    });
  });

  when("calling isSomeAnd", () => {
    then("on Some returns true of f(v) is true", () => {
      expect(someValue.isSomeAnd((v) => v === 0)).toBe(true);
    });
    then("on Some returns false of f(v) is false", () => {
      expect(someValue.isSomeAnd((v) => v !== 0)).toBe(false);
    });
    then("on Some returns false", () => {
      expect(noneValue.isSomeAnd((v) => v === 0)).toBe(false);
    });
  });

  when("calling map", () => {
    then("on Some(v) returns f(v)", () => {
      assertOption(
        new Some(10),
        someValue.map((v) => v + 10),
      );
    });

    then("on None returns None", () => {
      assertOption(
        new None(),
        noneValue.map((v) => v + 10),
      );
    });
  });

  when("calling mapOr", () => {
    then("on Some(v) returns f(v)", () => {
      expect(someValue.mapOr(10, (v) => v + 15)).toBe(15);
    });

    then("on None returns fallback", () => {
      expect(noneValue.mapOr(10, (v) => v + 15)).toBe(10);
    });
  });

  when("calling mapOrElse", () => {
    then("on Some(v) returns f(v)", () => {
      expect(
        someValue.mapOrElse(
          () => "hello",
          (v) => `${v + 10}`,
        ),
      ).toBe("10");
    });

    then("on None returns fallback())", () => {
      expect(
        noneValue.mapOrElse(
          () => "hello",
          (v) => `${v + 10}`,
        ),
      ).toBe("hello");
    });
  });

  when("calling okOr", () => {
    then("maps Some(v) to Ok(v)", () => {
      assertResult(new Ok(0), someValue.okOr("hello"));
    });

    then("maps None to Err(e)", () => {
      assertResult(new Err("hello"), noneValue.okOr("hello"));
    });
  });

  when("calling okOrElse", () => {
    then("maps Some(v) to Ok(v)", () => {
      assertResult(
        new Ok(0),
        someValue.okOrElse(() => "hello"),
      );
    });

    then("maps None to Err(err())", () => {
      assertResult(
        new Err("hello"),
        noneValue.okOrElse(() => "hello"),
      );
    });
  });

  when("calling or", () => {
    then("on Some(v) returns Some(v)", () => {
      assertOption(new Some(0), someValue.or(new Some(50)));
    });

    then("on None returns optB", () => {
      assertOption(new Some(50), noneValue.or(new Some(50)));
    });
  });

  when("calling orElse", () => {
    then("on Some(v) returns Some(v)", () => {
      assertOption(
        new Some(0),
        someValue.orElse(() => new Some(50)),
      );
    });

    then("on None returns f())", () => {
      assertOption(
        new Some(50),
        noneValue.orElse(() => new Some(50)),
      );
    });
  });

  when("calling replace", () => {
    then("on Some works as expected", () => {
      const optSome = someValue.replace(50);

      assertOption(new Some(0), optSome);
      assertOption(new Some(50), someValue);
    });

    then("on None works as expected", () => {
      const optNone = noneValue.replace(25);

      assertOption(new None(), optNone);
      assertOption(new Some(25), noneValue);
    });
  });

  when("calling take", () => {
    then("on Some works as expected", () => {
      assertOption(new Some(0), someValue.take());
      assertOption(new None(), someValue);
    });

    then("on None works as expected", () => {
      assertOption(new None(), noneValue.take());
      assertOption(new None(), noneValue);
    });
  });

  when("calling takeIf", () => {
    then("on Some takes if predicate is true", () => {
      assertOption(
        new Some(0),
        someValue.takeIf((v) => v === 0),
      );
      assertOption(new None(), someValue);
    });

    then("on Some don't takes if predicate is false", () => {
      assertOption(
        new None(),
        someValue.takeIf((v) => v !== 0),
      );
      assertOption(new Some(0), someValue);
    });

    then("on None nothing happens if predicate is true", () => {
      assertOption(
        new None(),
        noneValue.takeIf((v) => v === 0),
      );
      assertOption(new None(), noneValue);
    });

    then("on None nothing happens if predicate is false", () => {
      assertOption(
        new None(),
        noneValue.takeIf((v) => v !== 0),
      );
      assertOption(new None(), noneValue);
    });
  });

  when("calling unwrap", () => {
    then("on Some(v) returns v", () => {
      expect(someValue.unwrap()).toBe(0);
    });

    then("on None throws", () => {
      expect(() => noneValue.unwrap()).toThrow(
        new Error("Unwrapped a None value"),
      );
    });
  });

  when("calling unwrapOr", () => {
    then("on Some(v) returns v", () => {
      expect(someValue.unwrapOr(5)).toBe(0);
    });

    then("on None returns fallback", () => {
      expect(noneValue.unwrapOr(5)).toBe(5);
    });
  });

  when("calling unwrapOrElse", () => {
    then("on Some(v) returns v", () => {
      expect(someValue.unwrapOrElse(() => 15)).toBe(0);
    });

    then("on None returns f()", () => {
      expect(noneValue.unwrapOrElse(() => 15)).toBe(15);
    });
  });
});
