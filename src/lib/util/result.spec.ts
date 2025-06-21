import { Ok, Err, Result } from "./result";

function parseInt(input: string): Result<number, string> {
  const v = Number(input);

  if (/^\d+$/.test(input)) {
    return new Ok(v);
  } else {
    return new Err(`Could not parse input ${input}`);
  }
}

function assertResult<T, E>(expected: Result<T, E>, actual: Result<T, E>) {
  expect(actual.toString()).toBe(expected.toString());
}

describe("testing Result enum", () => {
  describe("testing .expect", () => {
    test("calling .expect on an Ok value", () => {
      const someValue = "Some Value";
      const res = new Ok(someValue);

      expect(res.expect("Not throw")).toBe(someValue);
    });

    test("calling .expect on an Err value", () => {
      const someValue = "Some Value";
      const res = new Err(someValue);

      expect(() => {
        res.expect("To throw");
      }).toThrow(/^To throw$/);
    });
  });

  describe("testing isOk", () => {
    test("on Ok value", () => {
      const res = new Ok("some value");
      expect(res.isOk()).toBeTruthy();
    });

    test("on Err value", () => {
      const res = new Ok("some value");
      expect(res.isErr()).toBeFalsy();
    });
  });

  describe("testing isErr", () => {
    test("on Ok value", () => {
      const res = new Ok("some value");
      expect(res.isErr()).toBeFalsy();
    });

    test("on Err value", () => {
      const res = new Err("some value");
      expect(res.isErr()).toBeTruthy();
    });
  });

  describe("testing map", () => {
    test("maps Ok value leaving Err untouched", () => {
      const okRes = parseInt("50").map((v) => v * 5);
      assertResult(new Ok(250), okRes);
    });

    test("maps Err value", () => {
      const errRes = parseInt("asdf").map((v) => v * 10);
      assertResult(new Err("Could not parse input asdf"), errRes);
    });
  });

  describe("testing mapOr", () => {
    test("maps Ok value", () => {
      const n = parseInt("5").mapOr(10, (val) => val * 5);
      expect(n).toBe(25);
    });

    test("maps Err value", () => {
      const n = parseInt("asf").mapOr(10, (val) => val * 5);
      expect(n).toBe(10);
    });
  });

  describe("testing mapErr", () => {
    const f = (e: string) => `The error was ${e}`;

    test("maps Ok value, leaving it untouched", () => {
      const res = parseInt("5").mapErr(f);

      assertResult(new Ok(5), res);
    });

    test("maps Err value", () => {
      const res = parseInt("asdf").mapErr(f);

      assertResult(new Err("The error was Could not parse input asdf"), res);
    });
  });
});
