import { expect } from "bun:test";
import { None, none, Some, some } from "./option";
import { given, then, when } from "./test-util";

when("option is a Some", () => {
  const someValue = some(123);

  given("and() is called", () => {
    then("optb should be returned", () => {
      const optb = some(456);
      const actual = someValue.and(optb);

      expect(actual).toBe(optb);
    });
  });

  given("andThen() is called", () => {
    then("the function result option should be returned", () => {
      const actual = someValue.andThen((val) => some(val * 2));
      expect(actual).toStrictEqual(some(246));
    });
  });

  given("expect() is called", () => {
    then("the wrapped value should be returned", () => {
      const actual = someValue.expect("unused message");
      expect(actual).toBe(123);
    });
  });

  given("filter() is called with a predicate that returns true", () => {
    then("the same Some should be returned", () => {
      const actual = someValue.filter((val) => val > 100);
      expect(actual).toBe(someValue);
    });
  });

  given("filter() is called with a predicate that returns false", () => {
    then("a None should be returned", () => {
      const actual = someValue.filter((val) => val < 0);
      expect(actual).toBeInstanceOf(None);
    });
  });

  given("isNone() is called", () => {
    then("false should be returned", () => {
      expect(someValue.isNone()).toBe(false);
    });
  });

  given("isNoneOr() is called", () => {
    then("the predicate result should be returned", () => {
      const actual = someValue.isNoneOr((val) => val > 100);
      expect(actual).toBe(true);
    });
  });

  given("isSome() is called", () => {
    then("true should be returned", () => {
      expect(someValue.isSome()).toBe(true);
    });
  });

  given("isSomeAnd() is called", () => {
    then("the predicate result should be returned", () => {
      const actual = someValue.isSomeAnd((val) => val < 0);
      expect(actual).toBe(false);
    });
  });

  given("map() is called", () => {
    then("the mapped Some should be returned", () => {
      const actual = someValue.map((val) => val.toString());
      expect(actual).toStrictEqual(some("123"));
    });
  });

  given("mapOr() is called", () => {
    then("the mapped Some should be returned and the default ignored", () => {
      const actual = someValue.mapOr(999, (val) => val * 2);
      expect(actual).toStrictEqual(some(246));
    });
  });

  given("mapOrElse() is called", () => {
    then(
      "the mapped Some should be returned and the default function ignored",
      () => {
        let defaultCalled = false;
        const actual = someValue.mapOrElse(
          () => {
            defaultCalled = true;
            return 0;
          },
          (val) => val * 2,
        );

        expect(defaultCalled).toBe(false);
        expect(actual).toStrictEqual(some(246));
      },
    );
  });

  given("or() is called", () => {
    then("the original Some should be returned", () => {
      const optb = some(456);
      const actual = someValue.or(optb);
      expect(actual).toBe(someValue);
    });
  });

  given("orElse() is called", () => {
    then(
      "the original Some should be returned and the function ignored",
      () => {
        let called = false;
        const actual = someValue.orElse(() => {
          called = true;
          return some(456);
        });

        expect(called).toBe(false);
        expect(actual).toBe(someValue);
      },
    );
  });

  given("unwrap() is called", () => {
    then("the wrapped value should be returned", () => {
      expect(someValue.unwrap()).toBe(123);
    });
  });

  given("unwrapOr() is called", () => {
    then("the wrapped value should be returned and the default ignored", () => {
      expect(someValue.unwrapOr(999)).toBe(123);
    });
  });

  given("unwrapOrElse() is called", () => {
    then(
      "the wrapped value should be returned and the function ignored",
      () => {
        let called = false;
        const actual = someValue.unwrapOrElse(() => {
          called = true;
          return 999;
        });

        expect(called).toBe(false);
        expect(actual).toBe(123);
      },
    );
  });
});

when("option is a None", () => {
  const noneValue = none<number>();

  given("and() is called", () => {
    then("a None should be returned", () => {
      const optb = some(456);
      const actual = noneValue.and(optb);
      expect(actual).toBeInstanceOf(None);
    });
  });

  given("andThen() is called", () => {
    then("a None should be returned and the function ignored", () => {
      let called = false;
      const actual = noneValue.andThen((val) => {
        called = true;
        return some(val * 2);
      });

      expect(called).toBe(false);
      expect(actual).toBeInstanceOf(None);
    });
  });

  given("expect() is called", () => {
    then("an error with the provided message should be thrown", () => {
      expect(() => noneValue.expect("missing value")).toThrow("missing value");
    });
  });

  given("filter() is called", () => {
    then("the same None should be returned", () => {
      const actual = noneValue.filter(() => true);
      expect(actual).toBe(noneValue);
    });
  });

  given("isNone() is called", () => {
    then("true should be returned", () => {
      expect(noneValue.isNone()).toBe(true);
    });
  });

  given("isNoneOr() is called", () => {
    then("true should be returned and the predicate ignored", () => {
      let called = false;
      const actual = noneValue.isNoneOr(() => {
        called = true;
        return false;
      });

      expect(called).toBe(false);
      expect(actual).toBe(true);
    });
  });

  given("isSome() is called", () => {
    then("false should be returned", () => {
      expect(noneValue.isSome()).toBe(false);
    });
  });

  given("isSomeAnd() is called", () => {
    then("false should be returned and the predicate ignored", () => {
      let called = false;
      const actual = noneValue.isSomeAnd(() => {
        called = true;
        return true;
      });

      expect(called).toBe(false);
      expect(actual).toBe(false);
    });
  });

  given("map() is called", () => {
    then("a None should be returned", () => {
      const actual = noneValue.map((val) => val.toString());
      expect(actual).toBeInstanceOf(None);
    });
  });

  given("mapOr() is called", () => {
    then("the default value should be wrapped in Some", () => {
      const actual = noneValue.mapOr(999, (val) => val * 2);
      expect(actual).toBeInstanceOf(Some);
      expect(actual.unwrap()).toBe(999);
    });
  });

  given("mapOrElse() is called", () => {
    then("the default function value should be wrapped in Some", () => {
      let called = false;
      const actual = noneValue.mapOrElse(
        () => {
          called = true;
          return 555;
        },
        (val) => val * 2,
      );

      expect(called).toBe(true);
      expect(actual).toBeInstanceOf(Some);
      expect(actual.unwrap()).toBe(555);
    });
  });

  given("or() is called", () => {
    then("optb should be returned", () => {
      const optb = some(456);
      const actual = noneValue.or(optb);
      expect(actual).toBe(optb);
    });
  });

  given("orElse() is called", () => {
    then("the function result should be returned", () => {
      const optb = some(456);
      const actual = noneValue.orElse(() => optb);
      expect(actual).toBe(optb);
    });
  });

  given("unwrap() is called", () => {
    then("an error should be thrown", () => {
      expect(() => noneValue.unwrap()).toThrow("Unwrapped a None value");
    });
  });

  given("unwrapOr() is called", () => {
    then("the default value should be returned", () => {
      expect(noneValue.unwrapOr(999)).toBe(999);
    });
  });

  given("unwrapOrElse() is called", () => {
    then("the function result should be returned", () => {
      let called = false;
      const actual = noneValue.unwrapOrElse(() => {
        called = true;
        return 888;
      });

      expect(called).toBe(true);
      expect(actual).toBe(888);
    });
  });
});
