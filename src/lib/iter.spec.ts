import { expect } from "bun:test";
import { Iter } from "./iter";
import { given, then, when } from "./test-util";

given("an iter", () => {
  when("from() is called", () => {
    then("collect() should return the same elements", () => {
      const iter = Iter.from([1, 2, 3]);
      expect(iter.collect()).toStrictEqual([1, 2, 3]);
    });
  });

  when("map() is called", () => {
    then("result should be mapped", () => {
      const iter = Iter.from([1, 2, 3, 4]).map((v) => `${v}`);
      expect(iter.collect()).toStrictEqual(["1", "2", "3", "4"]);
    });

    then("should pass index to the mapper", () => {
      const iter = Iter.from([10, 10, 10]).map((v, i) => v + i);
      expect(iter.collect()).toStrictEqual([10, 11, 12]);
    });

    then("should be lazy until collected", () => {
      let calls = 0;
      const iter = Iter.from([1, 2, 3]).map((v) => {
        calls++;
        return v * 2;
      });

      expect(calls).toBe(0);
      iter.collect();
      expect(calls).toBe(3);
    });
  });

  when("filter() is called", () => {
    then("result should be filtered", () => {
      const iter = Iter.from([1, 2, 3, 4, 5, 6]).filter((v) => v % 2 === 0);
      expect(iter.collect()).toStrictEqual([2, 4, 6]);
    });

    then("should pass index to the predicate", () => {
      const iter = Iter.from([10, 20, 30, 40]).filter((_, i) => i % 2 === 0);
      expect(iter.collect()).toStrictEqual([10, 30]);
    });

    then("should return empty when nothing matches", () => {
      const iter = Iter.from([1, 3, 5]).filter((v) => v % 2 === 0);
      expect(iter.collect()).toStrictEqual([]);
    });
  });

  when("collect() is called on a chained iterator", () => {
    then("should apply each operation once per element", () => {
      let mapCalls = 0;
      let filterCalls = 0;
      const iter = Iter.from([1, 2, 3, 4, 5])
        .map((v) => {
          mapCalls++;
          return v * 2;
        })
        .filter((v) => {
          filterCalls++;
          return v % 4 === 0;
        });

      expect(iter.collect()).toStrictEqual([4, 8]);
      expect(mapCalls).toBe(5);
      expect(filterCalls).toBe(5);
    });
  });

  when("all() is called", () => {
    then("should return true when all elements match", () => {
      const iter = Iter.from([2, 4, 6]);
      expect(iter.all((v) => v % 2 === 0)).toBe(true);
    });

    then("should return false when any element does not match", () => {
      const iter = Iter.from([2, 3, 4]);
      expect(iter.all((v) => v % 2 === 0)).toBe(false);
    });

    then("should short-circuit on first failure", () => {
      let calls = 0;
      const iter = Iter.from([2, 4, 5, 6]);
      const result = iter.all((v) => {
        calls++;
        return v % 2 === 0;
      });

      expect(result).toBe(false);
      expect(calls).toBe(3);
    });

    then("should return true for an empty iterator", () => {
      const iter = Iter.from<number>([]);
      expect(iter.all(() => false)).toBe(true);
    });
  });

  when("any() is called", () => {
    then("should return true when any element matches", () => {
      const iter = Iter.from([1, 3, 4, 7]);
      expect(iter.any((v) => v % 2 === 0)).toBe(true);
    });

    then("should return false when no elements match", () => {
      const iter = Iter.from([1, 3, 5]);
      expect(iter.any((v) => v % 2 === 0)).toBe(false);
    });

    then("should short-circuit on first match", () => {
      let calls = 0;
      const iter = Iter.from([1, 2, 4, 6]);
      const result = iter.any((v) => {
        calls++;
        return v % 2 === 0;
      });

      expect(result).toBe(true);
      expect(calls).toBe(2);
    });

    then("should return false for an empty iterator", () => {
      const iter = Iter.from<number>([]);
      expect(iter.any(() => true)).toBe(false);
    });
  });

  when("count() is called", () => {
    then("should return the number of items", () => {
      const iter = Iter.from([1, 2, 3, 4]);
      expect(iter.count()).toBe(4);
    });

    then("should be unchanged by mapping", () => {
      const iter = Iter.from([1, 2, 3]).map((v) => v * 10);
      expect(iter.count()).toBe(3);
    });
  });

  when("fold() is called", () => {
    then("should reduce values into an accumulator", () => {
      const iter = Iter.from([1, 2, 3, 4]);
      const sum = iter.fold(0, (acc, val) => acc + val);
      expect(sum).toBe(10);
    });

    then("should pass index to the reducer", () => {
      const iter = Iter.from([5, 5, 5]);
      const result = iter.fold(0, (acc, val, i) => acc + val + i);
      expect(result).toBe(18);
    });

    then("should honor filters before folding", () => {
      const iter = Iter.from([1, 2, 3, 4]).filter((v) => v % 2 === 0);
      const sum = iter.fold(0, (acc, val) => acc + val);
      expect(sum).toBe(6);
    });
  });

  when("take() is called", () => {
    then("should take the first n elements", () => {
      const iter = Iter.from([1, 2, 3, 4]).take(2);
      expect(iter.collect()).toStrictEqual([1, 2]);
    });

    then("should return empty when n is 0", () => {
      const iter = Iter.from([1, 2, 3]).take(0);
      expect(iter.collect()).toStrictEqual([]);
    });

    then("should return all elements when n exceeds length", () => {
      const iter = Iter.from([1, 2]).take(10);
      expect(iter.collect()).toStrictEqual([1, 2]);
    });
  });

  when("skip() is called", () => {
    then("should skip the first n elements", () => {
      const iter = Iter.from([1, 2, 3, 4]).skip(2);
      expect(iter.collect()).toStrictEqual([3, 4]);
    });

    then("should return all elements when n is 0", () => {
      const iter = Iter.from([1, 2, 3]).skip(0);
      expect(iter.collect()).toStrictEqual([1, 2, 3]);
    });

    then("should return empty when n exceeds length", () => {
      const iter = Iter.from([1, 2]).skip(10);
      expect(iter.collect()).toStrictEqual([]);
    });
  });
});
