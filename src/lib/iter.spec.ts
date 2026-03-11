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

  when("filter() is called", () => {
    then("result should be filtered", () => {
      const iter = Iter.from([1, 2, 3, 4, 5, 6]).filter((v) => v % 2 === 0);
      expect(iter.collect()).toStrictEqual([2, 4, 6]);
    });
  });
});
