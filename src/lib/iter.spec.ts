import { expect, test } from "bun:test";
import { Iter } from "./iter";
import { none, some } from "./option";
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

    then("should work with any type", () => {
      const initialValue: number[][] = [[]];
      const powerset = Iter.from([1, 2, 3, 4]).fold(
        initialValue,
        (acc, val) => [...acc, ...acc.map((s) => [...s, val])],
      );
      const expected = [
        [],
        [1],
        [2],
        [1, 2],
        [3],
        [1, 3],
        [2, 3],
        [1, 2, 3],
        [4],
        [1, 4],
        [2, 4],
        [1, 2, 4],
        [3, 4],
        [1, 3, 4],
        [2, 3, 4],
        [1, 2, 3, 4],
      ];
      expect(powerset.sort()).toStrictEqual(expected.sort());
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

  when("filterMap() is called", () => {
    then("should map and filter", () => {
      const iter = Iter.from([1, 2, 3, 4, 5, 6]).filterMap((val) =>
        val % 2 === 0 ? some(`${val}`) : none<string>(),
      );
      expect(iter.collect()).toStrictEqual(["2", "4", "6"]);
    });
  });

  when("chain() is called", () => {
    then("should concatenate iterators in order", () => {
      const iter = Iter.from([1, 2]).chain(Iter.from([3, 4]));
      expect(iter.collect()).toStrictEqual([1, 2, 3, 4]);
    });

    then("should handle empty iterators", () => {
      const iter = Iter.from<number>([]).chain(Iter.from([1, 2]));
      expect(iter.collect()).toStrictEqual([1, 2]);
    });

    then(
      "should avoid iterating the second iterator when short-circuited",
      () => {
        let rightCalls = 0;
        const left = Iter.from([1, 2]);
        const right = Iter.from([3, 4]).map((val) => {
          rightCalls++;
          return val;
        });

        const result = left.chain(right).any((val) => val === 2);
        expect(result).toBe(true);
        expect(rightCalls).toBe(0);
      },
    );
  });

  when("find() is called", () => {
    then("should pass index to the predicate", () => {
      const iter = Iter.from([10, 20, 30]);
      const result = iter.find((_, i) => i === 1);
      expect(result.isSome()).toBe(true);
      expect(result.unwrap()).toBe(20);
    });

    then("should return None when no element matches", () => {
      const iter = Iter.from([1, 2, 3]);
      const result = iter.find((val) => val > 10);
      expect(result.isNone()).toBe(true);
    });

    then("should short-circuit after the first match", () => {
      let calls = 0;
      const iter = Iter.from([1, 2, 3, 4]);
      const result = iter.find((val) => {
        calls++;
        return val === 2;
      });

      expect(result.isSome()).toBe(true);
      expect(result.unwrap()).toBe(2);
      expect(calls).toBe(2);
    });
  });

  when("findMap() is called", () => {
    then("should return the first Some result", () => {
      const iter = Iter.from([1, 2, 3, 4]);
      const result = iter.findMap((val) =>
        val % 2 === 0 ? some(`${val}`) : none<string>(),
      );
      expect(result.isSome()).toBe(true);
      expect(result.unwrap()).toBe("2");
    });

    then("should return None when no values map to Some", () => {
      const iter = Iter.from([1, 3, 5]);
      const result = iter.findMap(() => none<number>());
      expect(result.isNone()).toBe(true);
    });

    then("should short-circuit after the first Some", () => {
      let calls = 0;
      const iter = Iter.from([1, 2, 3, 4]);
      const result = iter.findMap((val) => {
        calls++;
        return val === 3 ? some(val * 10) : none<number>();
      });

      expect(result.isSome()).toBe(true);
      expect(result.unwrap()).toBe(30);
      expect(calls).toBe(3);
    });
  });

  when("forEach() is called", () => {
    then("should visit each element with index", () => {
      const visited: Array<{ val: string; index: number }> = [];
      Iter.from(["a", "b", "c"]).forEach((val, index) => {
        visited.push({ val, index });
      });

      expect(visited).toStrictEqual([
        { val: "a", index: 0 },
        { val: "b", index: 1 },
        { val: "c", index: 2 },
      ]);
    });

    then("should do nothing on an empty iterator", () => {
      let calls = 0;
      Iter.from<number>([]).forEach(() => {
        calls++;
      });
      expect(calls).toBe(0);
    });
  });

  when("mapWhile() is called", () => {
    then("should map while Some is returned", () => {
      const iter = Iter.from([1, 2, 3, 4]).mapWhile((val) =>
        val < 3 ? some(val * 2) : none<number>(),
      );
      expect(iter.collect()).toStrictEqual([2, 4]);
    });

    then("should stop after the first None", () => {
      let calls = 0;
      const iter = Iter.from([5, 6, 7, 8]).mapWhile((val, index) => {
        calls++;
        return index < 2 ? some(val) : none<number>();
      });

      expect(iter.collect()).toStrictEqual([5, 6]);
      expect(calls).toBe(3);
    });
  });

  when("takeWhile() is called", () => {
    then("should take values while predicate is true", () => {
      const iter = Iter.from([1, 2, 3, 0, 4]).takeWhile((val) => val > 0);
      expect(iter.collect()).toStrictEqual([1, 2, 3]);
    });

    then("should stop evaluating after the predicate fails", () => {
      let calls = 0;
      const iter = Iter.from([9, 8, 7, 6]).takeWhile((_val, index) => {
        calls++;
        return index < 2;
      });

      expect(iter.collect()).toStrictEqual([9, 8]);
      expect(calls).toBe(3);
    });
  });

  when("skipWhile() is called", () => {
    then(
      "should skip values while predicate is true and include first failure",
      () => {
        const iter = Iter.from([1, 2, 3, 4]).skipWhile((val) => val < 3);
        expect(iter.collect()).toStrictEqual([3, 4]);
      },
    );

    then("should yield all values when predicate is immediately false", () => {
      const iter = Iter.from([1, 2]).skipWhile(() => false);
      expect(iter.collect()).toStrictEqual([1, 2]);
    });

    then("should yield none when predicate is always true", () => {
      const iter = Iter.from([1, 2]).skipWhile(() => true);
      expect(iter.collect()).toStrictEqual([]);
    });
  });

  when("flatten() is called", () => {
    then("should flatten by one level nested structures", () => {
      const iter = Iter.from([
        [1, 2, 3],
        [4, 5, 6],
        [1, 2, 3],
      ]).flatten();

      expect(iter.collect()).toStrictEqual([1, 2, 3, 4, 5, 6, 1, 2, 3]);
    });

    then("should flatten by one level nested structures", () => {
      const iter = Iter.from([[[1, 2, 3]], [[4, 5, 6]], [[1, 2, 3]]]).flatten();

      expect(iter.collect()).toStrictEqual([
        [1, 2, 3],
        [4, 5, 6],
        [1, 2, 3],
      ]);
    });
  });

  when("flatMap() is called", () => {
    then("should map and flatten by one level", () => {
      const iter = Iter.from([1, 2, 3, 4, 5]).flatMap((val) => [val, val * 2]);

      expect(iter.collect()).toStrictEqual([1, 2, 2, 4, 3, 6, 4, 8, 5, 10]);
    });
  });
});

test("test whether consume or not", () => {
  const it1 = Iter.from([1, 2, 3, 4]);
  const arr1 = it1.collect();
  const it2 = it1.map((v) => v * 2);
  const arr2 = it2.collect();
  const it3 = it1.filter((v) => v % 2 === 0);
  const arr3 = it3.collect();

  expect(arr1).toStrictEqual([1, 2, 3, 4]);
  expect(arr2).toStrictEqual([2, 4, 6, 8]);
  expect(arr3).toStrictEqual([2, 4]);
});

test("collect exhausts when source is a single-use iterator", () => {
  const map = new Map([
    ["a", 1],
    ["b", 2],
    ["c", 3],
  ]);
  const values = map.values(); // Map iterator is single-use
  const iter = Iter.from(values);

  const first = iter.collect();
  const second = iter.collect();

  expect(first).toStrictEqual([1, 2, 3]);
  expect(second).toStrictEqual([]);
});
