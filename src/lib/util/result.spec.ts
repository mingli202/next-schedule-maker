import { Ok, Err, Result } from "./result";

function parseInt(input: string): Result<number, string> {
  const v = Number(input);

  if (/^\d+$/.test(input)) {
    return new Ok(v);
  } else {
    return new Err("Could not parse input");
  }
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
      expect(okRes.unwrap()).toBe(250);
    });

    test("maps Err value", () => {
      const errRes = parseInt("asdf").map((v) => v * 10);
      expect(errRes.unwrapErr()).toBe("Could not parse input");
    });
  });
});
