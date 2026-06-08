import { expect } from "bun:test";
import type { DayTime, Section } from "src/types/generated";
import { given, then, when } from "../test-util";
import isValidAdditionToSchedule, {
  isOverlap,
  isValidDayTimes,
} from "./isValidAdditionToSchedule";

const dayTimeFrom = (day: string, start: string, end: string): DayTime => ({
  day,
  startTimeHhmm: start,
  endTimeHhmm: end,
});

const sectionFrom = (code: string, dayTimesByLecLab: DayTime[][]): Section => ({
  id: "-1",
  course: "TEST",
  section: "A",
  domain: "TEST",
  code,
  title: "Test Section",
  leclabs: dayTimesByLecLab.map((dayTimes, index) => ({
    id: -(index + 1),
    title: `L${index + 1}`,
    type: "lecture",
    sectionId: -1,
    prof: "Prof",
    rating: null,
    dayTimes,
  })),
  more: "",
  viewData: [],
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
      const dayTimes1: DayTime = dayTimeFrom(d1[0], d1[1], d1[2]);
      const dayTimes2: DayTime = dayTimeFrom(d2[0], d2[1], d2[2]);
      // act
      const res1 = isOverlap(dayTimes1, dayTimes2);
      const res2 = isOverlap(dayTimes2, dayTimes1);
      // assert
      expect(res1).toBeTruthy();
      expect(res2).toBeTruthy();
    });
  });
});

given.each([
  [
    ["M", "0830", "1000"],
    ["T", "0830", "1000"],
  ],
  [
    ["M", "0830", "1000"],
    ["M", "1000", "1130"],
  ],
])("two non-overlapping dayTimes, %p %p", (d1, d2) => {
  when("isOverlap is called on them", () => {
    then("overlap should be false", () => {
      // arrange
      const dayTimes1: DayTime = dayTimeFrom(d1[0], d1[1], d1[2]);
      const dayTimes2: DayTime = dayTimeFrom(d2[0], d2[1], d2[2]);
      // act
      const res1 = isOverlap(dayTimes1, dayTimes2);
      const res2 = isOverlap(dayTimes2, dayTimes1);
      // assert
      expect(res1).toBeFalsy();
      expect(res2).toBeFalsy();
    });
  });
});

given("a list of non-overlapping dayTimes", () => {
  when("isValidDayTimes is called", () => {
    then("it should return true", () => {
      // arrange
      const dayTimes: DayTime[] = [
        dayTimeFrom("M", "0830", "1000"),
        dayTimeFrom("M", "1000", "1130"),
        dayTimeFrom("T", "0900", "1030"),
      ];
      // act
      const res = isValidDayTimes(dayTimes);
      // assert
      expect(res).toBeTruthy();
    });
  });
});

given("a list with at least one overlapping pair of dayTimes", () => {
  when("isValidDayTimes is called", () => {
    then("it should return false", () => {
      // arrange
      const dayTimes: DayTime[] = [
        dayTimeFrom("M", "0830", "1000"),
        dayTimeFrom("MW", "0930", "1100"),
        dayTimeFrom("F", "1300", "1400"),
      ];
      // act
      const res = isValidDayTimes(dayTimes);
      // assert
      expect(res).toBeFalsy();
    });
  });
});

given("an empty schedule", () => {
  when("isValidAdditionToSchedule is called", () => {
    then("it should return true", () => {
      // arrange
      const sectionToCheck = sectionFrom("CMPUT174 A1", [
        [dayTimeFrom("M", "0830", "1000")],
      ]);
      // act
      const res = isValidAdditionToSchedule(sectionToCheck, []);
      // assert
      expect(res).toBeTruthy();
    });
  });
});

given("a schedule with no code or time conflict", () => {
  when("isValidAdditionToSchedule is called", () => {
    then("it should return true", () => {
      // arrange
      const sectionToCheck = sectionFrom("CMPUT174 A1", [
        [dayTimeFrom("M", "0830", "1000")],
        [dayTimeFrom("W", "1200", "1300")],
      ]);
      const schedule: Section[] = [
        sectionFrom("CMPUT175 B1", [[dayTimeFrom("T", "0830", "1000")]]),
      ];
      // act
      const res = isValidAdditionToSchedule(sectionToCheck, schedule);
      // assert
      expect(res).toBeTruthy();
    });
  });
});

given("a schedule that already contains the same section code", () => {
  when("isValidAdditionToSchedule is called", () => {
    then("it should return false", () => {
      // arrange
      const sectionToCheck = sectionFrom("CMPUT174 A1", [
        [dayTimeFrom("M", "0830", "1000")],
      ]);
      const schedule: Section[] = [
        sectionFrom("CMPUT174 A1", [[dayTimeFrom("F", "1300", "1400")]]),
      ];
      // act
      const res = isValidAdditionToSchedule(sectionToCheck, schedule);
      // assert
      expect(res).toBeFalsy();
    });
  });
});

given("a schedule with a time conflict", () => {
  when("isValidAdditionToSchedule is called", () => {
    then("it should return false", () => {
      // arrange
      const sectionToCheck = sectionFrom("CMPUT174 A1", [
        [dayTimeFrom("MW", "0830", "1000")],
      ]);
      const schedule: Section[] = [
        sectionFrom("CMPUT175 B1", [[dayTimeFrom("W", "0930", "1030")]]),
      ];
      // act
      const res = isValidAdditionToSchedule(sectionToCheck, schedule);
      // assert
      expect(res).toBeFalsy();
    });
  });
});
