import { expect } from "bun:test";
import { Iter } from "./iter";
import { given, then, when } from "./test-util";

given("an iter", () => {
  when("map() is called", () => {
    then("result should be mapped", () => {
      const iter = Iter.from([1, 2, 3, 4]).map((v) => `${v}`);
      expect(iter.collect()).toStrictEqual(["1", "2", "3", "4"]);
    });
  });
});
