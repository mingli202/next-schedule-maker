import { expect } from "bun:test";
import {
  getSectionSectionsSectionIdGet,
  type DayTimeResponse,
  type SectionResponse,
} from "@/client";
import { given, then, when } from "../test-util";
import isValidAdditionToSchedule, {
  isOverlap,
  isValidDayTimes,
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

const sectionFrom = (
  code: string,
  dayTimesByLecLab: DayTimeResponse[][],
): SectionResponse => ({
  id: -1,
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
      const dayTimes1: DayTimeResponse = dayTimeFrom(d1[0], d1[1], d1[2]);
      const dayTimes2: DayTimeResponse = dayTimeFrom(d2[0], d2[1], d2[2]);
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
      const dayTimes: DayTimeResponse[] = [
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
      const dayTimes: DayTimeResponse[] = [
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
      const schedule: SectionResponse[] = [
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
      const schedule: SectionResponse[] = [
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
      const schedule: SectionResponse[] = [
        sectionFrom("CMPUT175 B1", [[dayTimeFrom("W", "0930", "1030")]]),
      ];
      // act
      const res = isValidAdditionToSchedule(sectionToCheck, schedule);
      // assert
      expect(res).toBeFalsy();
    });
  });
});

given("a real generated schedule", () => {
  when("isValidAdditionToSchedule is called", () => {
    then("it should return false", async () => {
      const scheduleIds = [
        {
          sectionId: 39,
          colorIndex: 0,
        },
        {
          sectionId: 152,
          colorIndex: 1,
        },
        {
          sectionId: 79,
          colorIndex: 2,
        },
        {
          sectionId: 85,
          colorIndex: 3,
        },
        {
          sectionId: 651,
          colorIndex: 4,
        },
        {
          sectionId: 819,
          colorIndex: 5,
        },
        {
          sectionId: 721,
          colorIndex: 6,
        },
      ];
      const scheduleResults = await Promise.all(
        scheduleIds.map((section) =>
          getSectionSectionsSectionIdGet({
            path: {
              section_id: section.sectionId,
            },
          }),
        ),
      );
      const schedule = scheduleResults
        .map((res) => res.data)
        .filter((s) => !!s);

      let dummySchedule: SectionResponse[] = [];

      let isValidSchedule = true;

      for (const section of schedule) {
        const validAddition = isValidAdditionToSchedule(section, dummySchedule);
        isValidSchedule &&= validAddition;
        dummySchedule = [...dummySchedule, section];
      }

      expect(isValidSchedule).toBeFalse();
    });
  });
});
