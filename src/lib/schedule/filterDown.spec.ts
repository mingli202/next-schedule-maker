import { expect } from "bun:test";
import { dayTimeFrom, leclabFrom, ratingFrom } from "src/lib/test-helpers/schedule";
import type { SectionStore } from "src/types";
import type { Section } from "src/types/generated";
import type { SearchSectionParams } from "src/types/schedule";
import { given, then, when } from "../test-util";
import { filterDown as baseFilterDown } from "./filterDown";

const sections: Section[] = [
  {
    id: "1",
    course: "Science",
    section: "A",
    domain: "CS",
    code: "110",
    title: "Intro to Programming",
    leclabs: [
      leclabFrom(11, 1, "Smith, Alice", ratingFrom("Smith, Alice", 4.5, 95), [
        dayTimeFrom(111, 11, "MW", "0900", "1000"),
      ]),
      leclabFrom(12, 1, "Jones, Bob", ratingFrom("Jones, Bob", 4.0, 85), [
        dayTimeFrom(112, 12, "F", "1000", "1100"),
      ]),
    ],
    more: "",
    viewData: [],
  },
  {
    id: "2",
    course: "Science",
    section: "B",
    domain: "CS",
    code: "210A",
    title: "Data Structures",
    leclabs: [
      leclabFrom(21, 2, "Stone, Carol", ratingFrom("Stone, Carol", 3.2, 70), [
        dayTimeFrom(121, 21, "T", "1300", "1430"),
      ]),
    ],
    more: "BLENDED with online content",
    viewData: [],
  },
  {
    id: "3",
    course: "Arts",
    section: "C",
    domain: "MATH",
    code: "150",
    title: "Calculus I",
    leclabs: [
      leclabFrom(31, 3, "Ng, Dana", ratingFrom("Ng, Dana", 4.8, 98), [
        dayTimeFrom(131, 31, "TR", "0800", "0930"),
      ]),
    ],
    more: "For Honours",
    viewData: [],
  },
  {
    id: "4",
    course: "Arts",
    section: "D",
    domain: "PHYS",
    code: "220B",
    title: "Quantum Theory",
    leclabs: [
      leclabFrom(41, 4, "Lee, Evan", null, [
        dayTimeFrom(141, 41, "W", "1500", "1600"),
      ]),
    ],
    more: "",
    viewData: [],
  },
  {
    id: "5",
    course: "Business",
    section: "E",
    domain: "ECON",
    code: "300",
    title: "Econometrics",
    leclabs: [
      leclabFrom(51, 5, "Patel, Farah", ratingFrom("Patel, Farah", 2.5, 55), [
        dayTimeFrom(151, 51, "F", "1800", "2000"),
      ]),
    ],
    more: "",
    viewData: [],
  },
  {
    id: "6",
    course: "Science",
    section: "F",
    domain: "BIO",
    code: "120",
    title: "Biology Basics",
    leclabs: [
      leclabFrom(
        61,
        6,
        "Smith, Aaron",
        ratingFrom("Smith, Aaron", 4.2, 90, "foundn't"),
        [dayTimeFrom(161, 61, "M", "1100", "1200")],
      ),
    ],
    more: "",
    viewData: [],
  },
];

const store: SectionStore = {
  semester: "fall 2026",
  sectionsById: new Map(sections.map((section) => [section.id, section])),
  professors: new Set(
    sections
      .flatMap((section) => section.leclabs.map((leclab) => leclab.prof))
      .filter((prof) => prof.trim() !== ""),
  ),
  codes: new Set(sections.map((section) => section.code)),
  filename: "",
  sectionsDiff: {
    previousSectionsChanged: [],
    sectionsAdded: [],
    sectionsRemoved: [],
  },
  comments: [],
};

const filterDown = (sectionStore: SectionStore, search: SearchSectionParams) =>
  baseFilterDown(sectionStore, { ...search, sections: undefined });

const idsFrom = (res: Section[]) =>
  res.map((section) => Number(section.id)).sort((a, b) => a - b);

const expectIds = (res: Section[], expected: number[]) => {
  expect(idsFrom(res)).toEqual([...expected].sort((a, b) => a - b));
};

given("empty search params", () => {
  when("filterDown is called", () => {
    then("it should return an empty list", () => {
      const search: SearchSectionParams = {};
      const res = filterDown(store, search);
      expect(res).toEqual([]);
    });
  });
});

given("search params with course filter", () => {
  when("filterDown is called", () => {
    then("it should match by course prefix", () => {
      const search: SearchSectionParams = { course: "science" };
      const res = filterDown(store, search);
      expectIds(res, [1, 2, 6]);
      for (const section of res) {
        expect(section.course.toLowerCase()).toContain("science");
      }
    });
  });
});

given("search params with domain filter", () => {
  when("filterDown is called", () => {
    then("it should match by domain prefix", () => {
      const search: SearchSectionParams = { domain: "cs" };
      const res = filterDown(store, search);
      expectIds(res, [1, 2]);
      for (const section of res) {
        expect(section.domain.toLowerCase()).toContain("cs");
      }
    });
  });
});

given("search params with code filter", () => {
  when("filterDown is called", () => {
    then("it should match by code substring", () => {
      const search: SearchSectionParams = { code: "10" };
      const res = filterDown(store, search);
      expectIds(res, [1, 2]);
      for (const section of res) {
        expect(section.code).toMatch(/10/);
      }
    });
  });
});

given("search params with title filter", () => {
  when("filterDown is called", () => {
    then("it should match by title prefix", () => {
      const search: SearchSectionParams = { title: "intro" };
      const res = filterDown(store, search);
      expectIds(res, [1]);
      for (const section of res) {
        expect(section.title.toLowerCase()).toContain("intro");
      }
    });
  });
});

given("search params with professor filter", () => {
  when("filterDown is called", () => {
    then("it should match by professor substring", () => {
      const search: SearchSectionParams = { prof: "smith" };
      const res = filterDown(store, search);
      expectIds(res, [1, 6]);
      for (const section of res) {
        expect(
          section.leclabs.some((leclab) =>
            leclab.prof.toLowerCase().includes("smith"),
          ),
        ).toBeTruthy();
      }
    });
  });
});

given("search params with rating min filter", () => {
  when("filterDown is called", () => {
    then("it should only include sections above rating min", () => {
      const search: SearchSectionParams = { ratingMin: 4 };
      const res = filterDown(store, search);
      expectIds(res, [1, 3]);
    });
  });
});

given("search params with rating max filter", () => {
  when("filterDown is called", () => {
    then("it should only include sections below rating max", () => {
      const search: SearchSectionParams = { ratingMax: 3.5 };
      const res = filterDown(store, search);
      expectIds(res, [2, 5]);
    });
  });
});

given("search params with score min filter", () => {
  when("filterDown is called", () => {
    then("it should only include sections above score min", () => {
      const search: SearchSectionParams = { scoreMin: 80 };
      const res = filterDown(store, search);
      expectIds(res, [1, 3]);
    });
  });
});

given("search params with score max filter", () => {
  when("filterDown is called", () => {
    then("it should only include sections below score max", () => {
      const search: SearchSectionParams = { scoreMax: 70 };
      const res = filterDown(store, search);
      expectIds(res, [2, 5]);
    });
  });
});

given("search params with days off filter", () => {
  when("filterDown is called", () => {
    then("it should exclude sections that meet on days off", () => {
      const search: SearchSectionParams = { daysOff: "M W" };
      const res = filterDown(store, search);
      expectIds(res, [2, 3, 5]);
    });
  });
});

given("search params with time start filter", () => {
  when("filterDown is called", () => {
    then("it should exclude sections starting before the time", () => {
      const search: SearchSectionParams = { timeStart: "9:00" };
      const res = filterDown(store, search);
      expectIds(res, [1, 2, 4, 5, 6]);
    });
  });
});

given("search params with time end filter", () => {
  when("filterDown is called", () => {
    then("it should exclude sections ending after the time", () => {
      const search: SearchSectionParams = { timeEnd: "16h00" };
      const res = filterDown(store, search);
      expectIds(res, [1, 2, 3, 4, 6]);
    });
  });
});

given("search params with blended filter", () => {
  when("filterDown is called", () => {
    then("it should return blended sections", () => {
      const search: SearchSectionParams = { blended: true };
      const res = filterDown(store, search);
      expectIds(res, [2]);
    });
  });
});

given("search params with honours filter", () => {
  when("filterDown is called", () => {
    then("it should return honours sections", () => {
      const search: SearchSectionParams = { honours: true };
      const res = filterDown(store, search);
      expectIds(res, [3]);
    });
  });
});

given("search params with combined filters", () => {
  when("filterDown is called", () => {
    then("it should apply all filters", () => {
      const search: SearchSectionParams = {
        course: "Science",
        ratingMin: 4,
        timeStart: "9:00",
      };
      const res = filterDown(store, search);
      expectIds(res, [1]);
    });
    then("it should respect combined exclusions", () => {
      const search: SearchSectionParams = {
        daysOff: "M",
        timeEnd: "1600",
      };
      const res = filterDown(store, search);
      expectIds(res, [2, 3, 4]);
    });
  });
});

given("search params with query time range", () => {
  when("filterDown is called", () => {
    then("it should match sections fully within the time range", () => {
      const search: SearchSectionParams = { q: "9:00-11:00" };
      const res = filterDown(store, search);
      expectIds(res, [1]);
    });
    then("it should accept unformatted time input", () => {
      const search: SearchSectionParams = { q: "9h00 to 11h00" };
      const res = filterDown(store, search);
      expectIds(res, [1]);
    });
  });
});

given("search params with query days off", () => {
  when("filterDown is called", () => {
    then("it should exclude days in the query", () => {
      const search: SearchSectionParams = { q: "MW" };
      const res = filterDown(store, search);
      expectIds(res, [2, 3, 5]);
    });
  });
});

given("search params with query code", () => {
  when("filterDown is called", () => {
    then("it should match code patterns", () => {
      const search: SearchSectionParams = { q: "110" };
      const res = filterDown(store, search);
      expectIds(res, [1]);
    });
  });
});

given("search params with query rating", () => {
  when("filterDown is called", () => {
    then("it should filter by rating tokens", () => {
      const search: SearchSectionParams = { q: "r>4" };
      const res = filterDown(store, search);
      expectIds(res, [1, 3]);
    });
  });
});

given("search params with query score", () => {
  when("filterDown is called", () => {
    then("it should filter by score tokens", () => {
      const search: SearchSectionParams = { q: "s<70" };
      const res = filterDown(store, search);
      expectIds(res, [2, 5]);
    });
  });
});

given("search params with query domain", () => {
  when("filterDown is called", () => {
    then("it should match domain patterns", () => {
      const search: SearchSectionParams = { q: "MATH" };
      const res = filterDown(store, search);
      expectIds(res, [3]);
    });
  });
});

given("search params with query flags", () => {
  when("filterDown is called", () => {
    then("it should match blended", () => {
      const search: SearchSectionParams = { q: "blended" };
      const res = filterDown(store, search);
      expectIds(res, [2]);
    });
    then("it should match honours", () => {
      const search: SearchSectionParams = { q: "honours" };
      const res = filterDown(store, search);
      expectIds(res, [3]);
    });
  });
});

given("search params with query professor", () => {
  when("filterDown is called", () => {
    then("it should match professors from the query", () => {
      const search: SearchSectionParams = { q: "smith" };
      const res = filterDown(store, search);
      expectIds(res, [1, 6]);
    });
  });
});

given("search params with query title fallback", () => {
  when("filterDown is called", () => {
    then("it should fall back to title matching", () => {
      const search: SearchSectionParams = { q: "Intro" };
      const res = filterDown(store, search);
      expectIds(res, [1]);
    });
  });
});

given("search params with combined query tokens", () => {
  when("filterDown is called", () => {
    then("it should apply each query token", () => {
      const search: SearchSectionParams = { q: "CS,    r>4, 9:00-11:00" };
      const res = filterDown(store, search);
      expectIds(res, [1]);
    });
  });
});

given("search params with many keyword query", () => {
  when("filterDown is called", () => {
    then("filter for every keyword", () => {
      const search: SearchSectionParams = { q: "nt prog" };
      const res = filterDown(store, search);
      expectIds(res, [1]);
    });
  });
});
