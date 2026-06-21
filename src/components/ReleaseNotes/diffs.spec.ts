import { expect } from "bun:test";
import { dayTimeFrom, leclabFrom } from "src/lib/test-helpers/schedule";
import { given, then, when } from "src/lib/test-util";
import { matchDaytimesForDiff, matchLeclabsForDiff } from "./diffs";

given("realistic section diff where leclabs are only reordered", () => {
  when("matching old and new leclabs", () => {
    then("it should pair by stable key and keep old order", () => {
      const oldLeclabs = [
        leclabFrom("LEC 01", "lecture", "Smith, Alice", [
          dayTimeFrom("MW", "0900", "1000"),
        ]),
        leclabFrom("LAB 51", "laboratory", "Jones, Bob", [
          dayTimeFrom("F", "1100", "1200"),
        ]),
      ];
      const newLeclabs = [oldLeclabs[1], oldLeclabs[0]];

      const { matchedOldItems, addedNewItems } = matchLeclabsForDiff(
        oldLeclabs,
        newLeclabs,
      );

      expect(addedNewItems).toEqual([]);
      expect(matchedOldItems.map((item) => item.newIndex)).toEqual([1, 0]);
      expect(matchedOldItems.every((item) => item.newItem !== undefined)).toBe(
        true,
      );
    });
  });
});

given(
  "realistic section diff where lecture details changed and a new component was added",
  () => {
    when("matching old and new leclabs", () => {
      then(
        "it should match changed lectures by fallback key, keep old order, and mark additions",
        () => {
          const oldLeclabs = [
            leclabFrom("LEC 01", "lecture", "Smith, Alice", [
              dayTimeFrom("MW", "0900", "1000"),
            ]),
            leclabFrom("LAB 51", "laboratory", "Jones, Bob", [
              dayTimeFrom("F", "1100", "1200"),
            ]),
          ];
          const newLeclabs = [
            leclabFrom("LAB 51", "laboratory", "Jones, Bob", [
              dayTimeFrom("F", "1100", "1200"),
            ]),
            leclabFrom("LEC 01", "lecture", "Taylor, Casey", [
              dayTimeFrom("MW", "0930", "1030"),
            ]),
            leclabFrom("TUT 99", "laboratory", "Morgan, Dee", [
              dayTimeFrom("T", "1300", "1400"),
            ]),
          ];

          const { matchedOldItems, addedNewItems } = matchLeclabsForDiff(
            oldLeclabs,
            newLeclabs,
          );

          expect(matchedOldItems.map((item) => item.oldItem.title)).toEqual([
            "LEC 01",
            "LAB 51",
          ]);
          expect(matchedOldItems.map((item) => item.newIndex)).toEqual([1, 0]);
          expect(addedNewItems.map((item) => item.item.title)).toEqual([
            "TUT 99",
          ]);
        },
      );
    });
  },
);

given(
  "realistic section diff where day times are reordered, changed, removed, and added",
  () => {
    when("matching old and new day times", () => {
      then(
        "it should keep old order for matched rows and identify removed and added rows",
        () => {
          const oldDaytimes = [
            dayTimeFrom("MW", "0900", "1000"),
            dayTimeFrom("F", "1000", "1100"),
            dayTimeFrom("R", "1400", "1500"),
          ];
          const newDaytimes = [
            dayTimeFrom("F", "1000", "1100"),
            dayTimeFrom("MW", "0930", "1030"),
            dayTimeFrom("T", "1300", "1400"),
          ];

          const { matchedOldItems, addedNewItems } = matchDaytimesForDiff(
            oldDaytimes,
            newDaytimes,
          );

          expect(matchedOldItems.map((item) => item.newIndex)).toEqual([
            1,
            0,
            undefined,
          ]);
          expect(matchedOldItems[2].newItem).toBeUndefined();
          expect(addedNewItems.map((item) => item.index)).toEqual([2]);
          expect(addedNewItems[0].item.day).toBe("T");
        },
      );
    });
  },
);
