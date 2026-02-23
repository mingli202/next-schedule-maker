import { expect } from "bun:test";
import type { DayTimeResponse } from "@/client";
import { given, then, when } from "../test-util";
import isValidAdditionToSchedule, {
  isOverlap,
} from "./isValidAdditionToSchedule";

const dayTimeFrom = (
  day: string,
  start: string,
  end: string,
): DayTimeResponse => ({
  day,
  startTimeHhmm: start,
  endTimeHhmm: end,
  id: -1,
  leclabId: -1,
});

given.each([
  [
    ["M", "0830", "1000"],
    ["MT", "0830", "1000"],
  ],
  [
    ["FM", "0830", "1000"],
    ["MY", "0900", "0930"],
  ],
  [
    ["MWER", "0830", "1000"],
    ["MOIU", "0900", "1030"],
  ],
  [
    ["EWRT", "0830", "1000"],
    ["POIT", "0800", "0930"],
  ],
])("two overlapping dayTimes, %p %p", (d1, d2) => {
  when("isOverlap is called on them", () => {
    then("overlap should be true", () => {
      // arrange
      const dayTimes1: DayTimeResponse = dayTimeFrom(d1[0], d1[1], d1[2]);
      const dayTimes2: DayTimeResponse = dayTimeFrom(d2[0], d2[1], d2[2]);
      // act
      const res1 = isOverlap(dayTimes1, dayTimes2);
      const res2 = isOverlap(dayTimes2, dayTimes1);
      // assert
      expect(res1).toBeTruthy();
      expect(res2).toBeTruthy();
    });
  });
});
