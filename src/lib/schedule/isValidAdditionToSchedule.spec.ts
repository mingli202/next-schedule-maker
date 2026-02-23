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

given("two overlapping dayTimes", () => {
  when("isOverlap is called on them", () => {
    then("should be false", () => {
      // arrange
      const dayTimes1: DayTimeResponse = dayTimeFrom("M", "0830", "1000");
      const dayTimes2: DayTimeResponse = dayTimeFrom("M", "0830", "1000");
      // act
      const res = isOverlap(dayTimes1, dayTimes2);
      // assert
      expect(res).toBeTruthy();
    });
  });
});
